package internal

import (
	"API_service/config"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

type ResponseUserID struct {
	UserID int `json:"user_id"`
}

type GenerateTokenRequest struct {
	UserID int `json:"user_id"`
}

func ProxyAuthHandler(w http.ResponseWriter, r *http.Request) {
	config.APILogger.Println("Request for authentication")
	var path string

	switch r.URL.Path {
	case "/user/register":
		path = "/register"
	case "/user/login":
		path = "/login"
	}

	AuthenticationHandler(w, r, path)
}

func AuthenticationHandler(w http.ResponseWriter, r *http.Request, path string) {

	config.APILogger.Println("Redirected to AuthenticationHandler")

	//Approaching database to create new user or check if the user exists
	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		config.APILogger.Println(err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req, err := http.NewRequest(http.MethodPost, config.DatabaseServiceURL+path, bytes.NewReader(reqBody))
	if err != nil {
		config.APILogger.Println(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := config.Client.Do(req)
	if err != nil {
		config.APILogger.Println(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		config.APILogger.Println("Error while authenticating user with database")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var response ResponseUserID

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		config.APILogger.Println("Error while reading the body of response: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = json.Unmarshal(body, &response)
	if err != nil {
		config.APILogger.Println("Error while unmarshalling: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	//Generating new token for new user
	var requestID ResponseUserID
	requestID.UserID = response.UserID

	jsonReq, err := json.Marshal(requestID)
	if err != nil {
		config.APILogger.Println("Error while marshalling: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	reqToken, err := http.NewRequest(http.MethodPost, config.AuthServiceURL+"/generate-token", bytes.NewReader(jsonReq))
	if err != nil {
		config.APILogger.Println(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	reqToken.Header.Set("Content-Type", "application/json")

	respToken, err := config.Client.Do(reqToken)
	if err != nil {
		config.APILogger.Println("Generation token request: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer respToken.Body.Close()

	if respToken.StatusCode != http.StatusOK {
		config.APILogger.Println("Error while generating token: Status " + respToken.Status)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	authHeader := respToken.Header.Get("Authorization")
	if authHeader == "" {
		config.APILogger.Println("Token is empty")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		config.APILogger.Println("Token is invalid")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	token := parts[1]

	config.APILogger.Println("Successfully generated token")
	w.Header().Set("Authorization", token)
	w.WriteHeader(http.StatusOK)
}

func CircuitsHandler(w http.ResponseWriter, r *http.Request) {
	config.APILogger.Println("Request for circuits")

	switch {
	case r.Method == http.MethodGet:
		GetAllCircuitsHandler(w, r)
	case r.Method == http.MethodPost:
		SaveNewCircuitHandler(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func GetAllCircuitsHandler(w http.ResponseWriter, r *http.Request) {
	_, write := w.Write([]byte("Get All Circuits"))
	if write != nil {
		return
	}
}

func SaveNewCircuitHandler(w http.ResponseWriter, r *http.Request) {
	_, write := w.Write([]byte("Save New Circuit"))
	if write != nil {
		return
	}
}

func StartSimulationHandler(w http.ResponseWriter, r *http.Request) {
	_, write := w.Write([]byte("Start Simulation"))
	if write != nil {
		return
	}
}
