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
	AuthServiceURL = "http:
	DatabaseServiceURL = "http:
	Client = &http.Client{}
	APILogger = log.New(os.Stdout, "LOGGER: ", log.LstdFlags)
}
