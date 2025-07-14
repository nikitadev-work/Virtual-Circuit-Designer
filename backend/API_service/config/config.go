package config

import (
	"log"
	"net/http"
	"os"
)

var AuthServiceURL string
var DatabaseServiceURL string
var RunningNodeServiceURL string
var Client *http.Client
var APILogger *log.Logger

func ConfigureServices() {
	AuthServiceURL = "http://auth-service:8081"
	DatabaseServiceURL = "http://database-service:8082"
	RunningNodeServiceURL = "http://runningnode-service:8084"

	Client = &http.Client{}
	APILogger = log.New(os.Stdout, "LOGGER: ", log.LstdFlags)
}
