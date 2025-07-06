package main

import (
	"RunningNode_service/config"
	"RunningNode_service/internal"
	"net/http"
)

func main() {
	config.ConfigureLogger()
	config.RNLogger.Println("RunningNode service started")
	http.HandleFunc("/circuits/simulate", internal.SimulateHandler)

	err := http.ListenAndServe(":8084", nil)
	if err != nil {
		return
	}
}
