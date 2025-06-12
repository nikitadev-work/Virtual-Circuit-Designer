package config

import "net/http"

var AuthServiceURL string
var DatabaseServiceURL string
var Client *http.Client

func ConfigureServices() {
	AuthServiceURL = "http://auth-service:8081"
	DatabaseServiceURL = "http://database-service:8082"
	Client = &http.Client{}
}
