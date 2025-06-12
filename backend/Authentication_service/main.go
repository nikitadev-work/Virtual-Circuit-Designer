package main

import (
	"Authentication_service/config"
	"Authentication_service/internal"
	"net/http"
)

func main() {
	config.ConfigureLogger()
	config.AuthLogger.Println("Authentication service started")

	http.HandleFunc("/check-token", internal.CheckJWTTokenHandler)
	http.HandleFunc("/generate-token", internal.GenerateJWTTokenHandler)

	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		return
	}
}
