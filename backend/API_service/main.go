package main

import (
	"API_service/internal"
	"net/http"
)

func main() {
	http.HandleFunc("/user/register", internal.RegistrationHandler)
	http.HandleFunc("/user/login", internal.LoginHandler)
	http.HandleFunc("/circuits", internal.CircuitsHandler)
	http.HandleFunc("/circuits/simulate", internal.StartSimulationHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		return
	}
}
