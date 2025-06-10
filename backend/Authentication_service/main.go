package main

import (
	"Authentication_service/internal"
	"net/http"
)

func main() {
	http.HandleFunc("/auth/check-token", internal.CheckJWTTokenHandler)
	http.HandleFunc("/auth/generate-token", internal.GenerateJWTTokenHandler)

	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		return
	}
}
