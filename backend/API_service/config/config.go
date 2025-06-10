package config

import "net/http"

var AuthServiceURL string
var Client *http.Client

func ConfigureServices() {
	AuthServiceURL = "http://auth-service:8081"
	Client = &http.Client{}
}
