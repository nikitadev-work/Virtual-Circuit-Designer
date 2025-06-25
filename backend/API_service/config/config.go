package config

import (
	"log"
	"net/http"
	"os"
)

var AuthServiceURL string
var DatabaseServiceURL string
var Client *http.Client
var APILogger *log.Logger

func ConfigureServices() {
	AuthServiceURL = "http://auth-service:8081"
	DatabaseServiceURL = "http://database-service:8082"
	Client = &http.Client{}
	APILogger = log.New(os.Stdout, "LOGGER: ", log.LstdFlags)
}
