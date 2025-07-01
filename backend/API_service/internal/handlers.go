package internal

import (
	"API_service/config"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

type ResponseUser struct {
	UserID    int    `json:"user_id"`
	UserName  string `json:"user_name"`
	UserEmail string `json:"user_email"`
}

type GenerateTokenRequest struct {
	UserID    int    `json:"user_id"`
	UserName  string `json:"user_name"`
	UserEmail string `json:"user_email"`
}

type Circuit struct {
	UserID             int      `json:"user_id"`
	Name               string   `json:"circuit_name"`
	CircuitDescription [][3]any `json:"circuit_description"`
}

func writeCORS(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	if origin == "" {
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Vary", "Origin")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}

func ProxyAuthHandler(w http.ResponseWriter, r *http.Request) {
	config.APILogger.Println("Request for authentication")
	var path string

	switch r.URL.Path {
	case "/api/user/register":
		path = "/register"
	case "/api/user/login":
		path = "/login"
	}

	AuthenticationHandler(w, r, path)
}

func AuthenticationHandler(w http.ResponseWriter, r *http.Request, path string) {
	config.APILogger.Println("Redirected to AuthenticationHandler")

	writeCORS(w, r)

	if r.Method == http.MethodOptions {
		config.APILogger.Println("Type of request: OPTIONS")
		w.WriteHeader(http.StatusNoContent)
		config.APILogger.Println("OPTIONS request completed")
		return
	}

	//Approaching database to create new user or check if the user exists
	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		config.APILogger.Println(err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	config.APILogger.Printf(
		"Request Body: \n %s",
		string(reqBody),
	)

	fullURL := config.DatabaseServiceURL + path

	req, err := http.NewRequest(http.MethodPost, fullURL, bytes.NewReader(reqBody))
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

	if resp.StatusCode != http.StatusOK {
		config.APILogger.Println("Error while authenticating user with database")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	var response ResponseUser

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
	var request ResponseUser
	request.UserID = response.UserID
	request.UserName = response.UserName
	request.UserEmail = response.UserEmail

	jsonReq, err := json.Marshal(request)
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

	config.APILogger.Println("authHeader:", authHeader)

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

func RequestsWithTokenHandler(w http.ResponseWriter, r *http.Request) {
	config.APILogger.Println("Request with token")

	//Token verification
	authHeader := r.Header.Get("Authorization")
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

	req, err := http.NewRequest(http.MethodPost, config.AuthServiceURL+"/check-token", nil)
	if err != nil {
		config.APILogger.Println("Request with token: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", authHeader)

	resp, err := config.Client.Do(req)
	if err != nil {
		config.APILogger.Println("Request with token(error while checking token): " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		config.APILogger.Println("Error while checking token: Status " + resp.Status)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	var response Circuit

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

	switch r.URL.Path {
	case "/circuits":
		CircuitsHandler(w, r, response.UserID)
	case "/circuits/simulate":
		StartSimulationHandler(w, r)
	default:
		config.APILogger.Println("Error while processing request: " + r.URL.Path)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
}

func CircuitsHandler(w http.ResponseWriter, r *http.Request, userID int) {
	config.APILogger.Println("Redirected to CircuitsHandler")

	switch {
	case r.Method == http.MethodGet:
		GetAllCircuitsHandler(w, r, userID)
	case r.Method == http.MethodPost:
		SaveNewCircuitHandler(w, r, userID)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func GetAllCircuitsHandler(w http.ResponseWriter, r *http.Request, userID int) {
	config.APILogger.Println("Redirected to GetAllCircuitsHandler")

}

func SaveNewCircuitHandler(w http.ResponseWriter, r *http.Request, userID int) {
	config.APILogger.Println("Redirected to SaveNewCircuitHandler")

	var response Circuit

	body, err := io.ReadAll(r.Body)
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

	response.UserID = userID

	req, err := http.NewRequest(http.MethodPost, config.DatabaseServiceURL+"/circuits", bytes.NewReader(body))
	if err != nil {
		config.APILogger.Println("Error while creating request: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := config.Client.Do(req)
	if err != nil {
		config.APILogger.Println("Error while sending request: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer resp.Body.Close()
	if resp.StatusCode != http.StatusCreated {
		config.APILogger.Println("Request on saving new circuit: Status " + resp.Status)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	config.APILogger.Println("Successfully saved new circuit")
	w.WriteHeader(http.StatusCreated)
}

func StartSimulationHandler(w http.ResponseWriter, r *http.Request) {
	config.APILogger.Println("Redirected to StartSimulationHandler")

}
