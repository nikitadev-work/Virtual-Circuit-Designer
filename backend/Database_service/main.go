package main

import (
	"Database_service/internal/handlers"
	"Database_service/internal/storage"
	"net/http"
)

func main() {
	db := storage.NewPostgresDB()
	handler := handlers.NewDBHandler(db)

	http.HandleFunc("/db/user/register", handler.RegistrationHandler)
	http.HandleFunc("/db/user/login", handler.LoginHandler)
	http.HandleFunc("/db/circuits", handler.CircuitsHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
