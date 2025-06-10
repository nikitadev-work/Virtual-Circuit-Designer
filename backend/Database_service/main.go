package main

import (
	"Database_service/internal/handlers"
	"net/http"
)

func main() {
	http.HandleFunc("/db/user/register", handlers.RegistrationHandler)
	http.HandleFunc("/db/user/login", handlers.LoginHandler)
	http.HandleFunc("/db/circuits", handlers.CircuitsHandler)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
