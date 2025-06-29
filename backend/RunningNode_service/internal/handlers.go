package internal

import (
	"RunningNode_service/config"
	"encoding/json"
	"net/http"
	"os"
)

func SimulateHandler(resp http.ResponseWriter, req *http.Request) {
	config.RNLogger.Println("Circuit simulation request")

	var requestData struct {
		Circuit [][]interface{} `json:"scheme_data"`
	}

	err := json.NewDecoder(req.Body).Decode(&requestData)

	if err != nil {
		config.RNLogger.Println("Circuit simulation request: ", err.Error())
		http.Error(resp, "Invalid request body", http.StatusBadRequest)
		return
	}

	file, err := os.Create("test.json")

	if err != nil {
		config.RNLogger.Println("Failed to create JSON file: ", err.Error())
		http.Error(resp, "Failed to create JSON file", http.StatusInternalServerError)
		return
	}

	defer file.Close()

	jsonData, err := json.Marshal(requestData.Circuit)
	if err != nil {
		config.RNLogger.Println("Failed to encode circuit to JSON data: ", err.Error())
		http.Error(resp, "Failed to encode circuit to JSON data", http.StatusInternalServerError)
		return
	}

	_, err = file.Write(jsonData)
	if err != nil {
		config.RNLogger.Println("Falied to write json data to file: ", err.Error())
		http.Error(resp, "Falied to write json data to file", http.StatusInternalServerError)
		return
	}
}
