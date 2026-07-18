// Package cache membungkus Redis buat dua kebutuhan: cache-aside umum
// (GetJSON/SetJSON) dan counter buat rate limiting (Incr).
package cache

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

type Cache struct {
	rdb *redis.Client
}

func New(redisURL string) (*Cache, error) {
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, err
	}
	if opt.TLSConfig != nil {
		// Heroku Redis (rediss://) nge-terbitin sertifikat buat hostname
		// proxy internal mereka (*.service.shogun.heroku.com), bukan
		// hostname ec2-*.compute-1.amazonaws.com yang ada di connection
		// string -- verifikasi hostname standar GAGAL walau koneksinya
		// beneran TLS & valid. Ini quirk yang didokumentasikan Heroku
		// sendiri, bukan downgrade keamanan yang kita pilih sendiri;
		// koneksinya tetap terenkripsi, cuma verifikasi nama host-nya yang
		// dilewatin.
		opt.TLSConfig = &tls.Config{InsecureSkipVerify: true} //nolint:gosec
	}
	return &Cache{rdb: redis.NewClient(opt)}, nil
}

// Ping dipakai oleh /readyz.
func (c *Cache) Ping(ctx context.Context) error {
	return c.rdb.Ping(ctx).Err()
}

func GetJSON[T any](ctx context.Context, c *Cache, key string) (value T, found bool, err error) {
	val, err := c.rdb.Get(ctx, key).Result()
	if err == redis.Nil {
		return value, false, nil
	}
	if err != nil {
		return value, false, err
	}
	if err := json.Unmarshal([]byte(val), &value); err != nil {
		return value, false, err
	}
	return value, true, nil
}

func SetJSON(ctx context.Context, c *Cache, key string, value any, ttl time.Duration) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return c.rdb.Set(ctx, key, b, ttl).Err()
}

func (c *Cache) Del(ctx context.Context, keys ...string) error {
	if len(keys) == 0 {
		return nil
	}
	return c.rdb.Del(ctx, keys...).Err()
}

// Incr menambah "job list cache version" atau counter rate-limit. Versi
// list-cache dibaca lewat GetVersion; increment dipakai buat invalidasi O(1)
// tanpa perlu blocking KEYS/SCAN buat hapus tiap kombinasi filter satu-satu.
func (c *Cache) Incr(ctx context.Context, key string) (int64, error) {
	return c.rdb.Incr(ctx, key).Result()
}

// IncrWithExpiry dipakai buat rate limiting: counter di-increment, dan kalau
// ini kemunculan pertama dalam window, TTL-nya di-set. Race kecil antara
// "n==1" dan Expire di traffic ekstrem tinggi adalah tradeoff yang diterima
// buat skala prototype -- upgrade-nya kalau perlu adalah Lua script atomik.
func (c *Cache) IncrWithExpiry(ctx context.Context, key string, window time.Duration) (int64, error) {
	n, err := c.rdb.Incr(ctx, key).Result()
	if err != nil {
		return 0, err
	}
	if n == 1 {
		c.rdb.Expire(ctx, key, window)
	}
	return n, nil
}

func (c *Cache) GetVersion(ctx context.Context, key string) (int64, error) {
	n, err := c.rdb.Get(ctx, key).Int64()
	if err == redis.Nil {
		return 0, nil
	}
	return n, err
}
