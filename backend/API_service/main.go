package main

import (
	"API_service/config"
	"API_service/internal"
	"net/http"
)

func main() {
	config.ConfigureServices()

	http.HandleFunc("/user/register", internal.ProxyAuthHandler)
	http.HandleFunc("/user/login", internal.ProxyAuthHandler)
	http.HandleFunc("/circuits", internal.CircuitsHandler)
	http.HandleFunc("/circuits/simulate", internal.StartSimulationHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		return
	}
}
