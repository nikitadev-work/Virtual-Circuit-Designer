package main

import (
	"Database_service/config"
	"Database_service/internal"
	"log"
	"net/http"
)

func main() {
	config.ConfigureLogger()

	connStr := "host=database user=vcddbuser password=vcddbpassword dbname=vcddbname sslmode=disable"
	db := internal.NewPostgresDB(connStr)
	handler := internal.NewDBHandler(db)
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
