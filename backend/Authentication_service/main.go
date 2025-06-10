package main

import (
	"Authentication_service/internal"
	"net/http"
)

func main() {
	http.HandleFunc("/user/register", internal.RegistrationHandler)
	http.HandleFunc("/user/login", internal.LoginHandler)

	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		return
	}
}
