// Package storage cuma punya satu tanggung jawab: terbitkan presigned PUT
// URL buat upload CV. Browser upload langsung ke object storage (MinIO
// lokal / S3-compatible di prod) -- api-go gak pernah nampung file bytes di
// memory/bandwidth-nya sendiri.
package storage

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Storage struct {
	presign *s3.PresignClient
	bucket  string
}

func New(ctx context.Context, endpoint, accessKey, secretKey, bucket string, usePathStyle bool) (*Storage, error) {
	cfg, err := awsconfig.LoadDefaultConfig(ctx,
		awsconfig.WithRegion("us-east-1"), // diabaikan sama MinIO, tapi SDK butuh nilai non-kosong
		awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
	)
	if err != nil {
		return nil, fmt.Errorf("storage: load aws config: %w", err)
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(endpoint)
		o.UsePathStyle = usePathStyle
	})

	return &Storage{presign: s3.NewPresignClient(client), bucket: bucket}, nil
}

func (s *Storage) PresignPutCV(ctx context.Context, objectKey string, expires time.Duration) (string, error) {
	req, err := s.presign.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(objectKey),
	}, s3.WithPresignExpires(expires))
	if err != nil {
		return "", fmt.Errorf("storage: presign put: %w", err)
	}
	return req.URL, nil
}

// PresignGetObject terbitin presigned GET URL, dipakai HRD buat playback
// audio jawaban interview kandidat tanpa api-go pernah nampung bytes-nya.
func (s *Storage) PresignGetObject(ctx context.Context, objectKey string, expires time.Duration) (string, error) {
	req, err := s.presign.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(objectKey),
	}, s3.WithPresignExpires(expires))
	if err != nil {
		return "", fmt.Errorf("storage: presign get: %w", err)
	}
	return req.URL, nil
}
