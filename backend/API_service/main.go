package main

import (
	"API_service/config"
	"API_service/internal"
	"net/http"
)

func main() {
	config.ConfigureServices()
	config.APILogger.Println("API service started")

	http.HandleFunc("/user/register", internal.ProxyAuthHandler)
	http.HandleFunc("/user/login", internal.ProxyAuthHandler)
	http.HandleFunc("/circuits", internal.RequestsWithTokenHandler)
	http.HandleFunc("/circuits/simulate", internal.RequestsWithTokenHandler)

	err := http.ListenAndServe(":8052", nil)
	if err != nil {
		return
	}
}
