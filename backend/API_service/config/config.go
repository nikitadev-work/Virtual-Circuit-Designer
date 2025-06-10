package config

import "net/http"

var AuthServiceURL string
var Client *http.Client

func ConfigureServices() {
	AuthServiceURL = "http://localhost:8081/auth-service/"
	Client = &http.Client{}
}
