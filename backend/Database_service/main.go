package main

import (
	"Database_service/config"
	"Database_service/internal"
	"log"
	"net/http"
)

func main() {
	config.ConfigureLogger()

	connStr := "host=database port=5432 user=vcddbuser password=vcddbpassword dbname=vcddbname sslmode=disable connect_timeout=5"
	db := internal.NewPostgresDB(connStr)
	handler := internal.NewDBHandler(db)
	err := db.CreateTables()
	if err != nil {
		config.DbLogger.Println(err)
		log.Fatal(err)
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request: %s %s\n", r.Method, r.URL.Path)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Request received at: " + r.URL.Path))
	})

	http.HandleFunc("/register", handler.RegistrationHandler)
	http.HandleFunc("/login", handler.LoginHandler)
	http.HandleFunc("/circuits", handler.CircuitsHandler)
	http.HandleFunc("/circuits/", handler.CircuitByIDHandler)
	err = http.ListenAndServe(":8082", nil)
	if err != nil {
		panic(err)
	}
}
