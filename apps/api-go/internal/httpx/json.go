// Package httpx berisi helper HTTP kecil yang dipakai bareng oleh semua
// modul internal, biar nggak duplikasi encoder JSON di tiap package.
package httpx

import (
	"encoding/json"
	"net/http"
)

// WriteJSON menulis body sebagai JSON dengan status code tertentu.
func WriteJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}
