package internal

import (
	"RunningNode_service/config"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

type CircuitSimulation struct {
	Circuit string `json:"circuit"`
}

type SimulationResult struct {
	Result string `json:"simulation_result"`
}

func SimulateHandler(resp http.ResponseWriter, req *http.Request) {
	config.RNLogger.Println("Circuit simulation request")
	var circuit CircuitSimulation
	err := json.NewDecoder(req.Body).Decode(&circuit)

	if err != nil {
		config.RNLogger.Println("Circuit simulation request: ", err.Error())
		http.Error(resp, "Invalid request body", http.StatusBadRequest)
		return
	}

	urlVerilog := "Url of Iskander programm"
	jsonCircuit, err := json.Marshal(circuit)
	if err != nil {
		config.RNLogger.Println("Error serializing JSON of circuit: ", err.Error())
		http.Error(resp, "Server error", http.StatusInternalServerError)
		return
	}

	reqVerilog, err := http.NewRequest("POST", urlVerilog, bytes.NewBuffer(jsonCircuit))
	if err != nil {
		config.RNLogger.Println("Error while making HTTP request: ", err.Error())
		http.Error(resp, "Server error", http.StatusInternalServerError)
		return
	}

	reqVerilog.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	respVerilog, err := client.Do(reqVerilog)
	if err != nil {
		config.RNLogger.Println("Simulation error: ", err.Error())
		http.Error(resp, "Simulation server error", http.StatusInternalServerError)
		return
	}

	defer respVerilog.Body.Close()

	// We get result as JSON("simulation_resuilt": result)
	bodyVerilog, err := io.ReadAll(respVerilog.Body)
	if err != nil {
		config.RNLogger.Println("Body getting of verilog error: ", err.Error())
		http.Error(resp, "Simulation server error", http.StatusInternalServerError)
		return
	}

	var result SimulationResult
	err = json.Unmarshal(bodyVerilog, &result)
	if err != nil {
		config.RNLogger.Println("Invalid JSON from Verilog: ", err.Error())
		http.Error(resp, "Invalid simulation response", http.StatusInternalServerError)
		return
	}

	resp.Header().Set("Content-Type", "application/json")
	resp.WriteHeader(http.StatusOK)
	json.NewEncoder(resp).Encode(result)
}
