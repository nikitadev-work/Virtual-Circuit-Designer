package internal

import (
	"API_service/config"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
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
	UserId             int      `json:"user_id"`
	CircuitName        string   `json:"circuit_name"`
	Circuit            [][3]any `json:"circuit_description"`
	CircuitInputs      []int    `json:"circuit_inputs"`
	CircuitCoordinates [][]any  `json:"circuit_coordinates"`
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

	writeCORS(w, r)

	if r.Method == http.MethodOptions {
		config.APILogger.Println("Type of request: OPTIONS")
		w.WriteHeader(http.StatusNoContent)
		config.APILogger.Println("OPTIONS request completed")
		return
	}

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

	path := strings.TrimSuffix(r.URL.Path, "/")
	parts = strings.Split(path, "/")

	switch {
	case len(parts) == 3: // "/api/circuits
		CircuitsHandler(w, r, response.UserId)
	case len(parts) == 4 && parts[3] == "simulate": // "/api/circuits/simulate
		StartSimulationHandler(w, r)
	case len(parts) == 4: // "/api/circuits/{id}
		circuitID, err := strconv.Atoi(parts[3])
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		GetCircuitByIDHandler(w, r, response.UserId, circuitID)
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

	writeCORS(w, r)

	reqURL := fmt.Sprintf(config.DatabaseServiceURL+"/circuits?user_id=%d", userID)

	req, err := http.NewRequest(http.MethodGet, reqURL, nil)
	if err != nil {
		config.APILogger.Println(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := config.Client.Do(req)
	if err != nil {
		config.APILogger.Println("Get all circuits by ID: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		config.APILogger.Println("Error while getting all circuits by ID: Status " + resp.Status)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = io.Copy(w, resp.Body)
	if err != nil {
		config.APILogger.Println("Error while copying the body to response: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func GetCircuitByIDHandler(w http.ResponseWriter, r *http.Request, userID int, circuitID int) {
	config.APILogger.Println("Redirected to GetCircuitByIDHandler")

	writeCORS(w, r)

	reqURL := fmt.Sprintf(config.DatabaseServiceURL+"/circuits/%d?user_id=%d", userID, circuitID)

	req, err := http.NewRequest(http.MethodGet, reqURL, nil)
	if err != nil {
		config.APILogger.Println(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := config.Client.Do(req)
	if err != nil {
		config.APILogger.Println("Get circuit by ID: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		config.APILogger.Println("Error while getting circuit by ID: Status " + resp.Status)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = io.Copy(w, resp.Body)
	if err != nil {
		config.APILogger.Println("Error while copying the body to response: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func SaveNewCircuitHandler(w http.ResponseWriter, r *http.Request, userID int) {
	config.APILogger.Println("Redirected to SaveNewCircuitHandler")

	writeCORS(w, r)

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

	response.UserId = userID

	newBody, _ := json.Marshal(response)

	req, err := http.NewRequest(http.MethodPost, config.DatabaseServiceURL+"/circuits", bytes.NewReader(newBody))
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

	writeCORS(w, r)

}
