package main

import (
	"API_service/config"
	"API_service/internal"
	"net/http"
)

func main() {

	config.ConfigureServices()
	config.APILogger.Println("API service started")

	http.HandleFunc("/api/user/register", internal.ProxyAuthHandler)
	http.HandleFunc("/api/user/login", internal.ProxyAuthHandler)
	http.HandleFunc("/api/circuits", internal.RequestsWithTokenHandler)
	http.HandleFunc("/api/circuits/simulate", internal.RequestsWithTokenHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		return
	}
}
