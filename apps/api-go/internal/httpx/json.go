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

type errorBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type errorEnvelope struct {
	Error errorBody `json:"error"`
}

// WriteError menulis error response dalam amplop JSON yang konsisten
// ({"error":{"code","message"}}), menggantikan campuran http.Error(plain
// text) dan WriteJSON ad hoc yang sebelumnya dipakai bergantian di
// handler-handler. ai-engine (Python) memakai bentuk amplop yang sama
// (app/errors.py) biar frontend cuma perlu satu cara parse error dari
// kedua service.
func WriteError(w http.ResponseWriter, status int, code, message string) {
	WriteJSON(w, status, errorEnvelope{Error: errorBody{Code: code, Message: message}})
}
