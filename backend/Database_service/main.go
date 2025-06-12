package main

import (
	"Database_service/config"
	"Database_service/internal/handlers"
	"Database_service/internal/storage"
	"log"
	"net/http"
)

func main() {
	config.ConfigureLogger()

	db := storage.NewPostgresDB()
	handler := handlers.NewDBHandler(db)
	err := db.CreateTables()
	if err != nil {
		config.DbLogger.Println(err)
		log.Fatal(err)
	}

	http.HandleFunc("/register", handler.RegistrationHandler)
	http.HandleFunc("/login", handler.LoginHandler)
	http.HandleFunc("/circuits", handler.CircuitsHandler)

	err = http.ListenAndServe(":8082", nil)
	if err != nil {
		panic(err)
	}
}
