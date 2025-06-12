package handlers

import (
	"Database_service/config"
	"Database_service/internal/storage"
	"encoding/json"
	"net/http"

	_ "github.com/lib/pq"
)

type DBHandler struct {
	db *storage.PostgresDB
}

func NewDBHandler(db *storage.PostgresDB) *DBHandler {
	config.DbLogger.Println("Creating DB handler")
	return &DBHandler{db: db}
}

type RegistrationRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CircuitPostRequest struct {
	UserId      int    `json:"user_id"`
	CircuitName string `json:"circuit_name"`
	Circuit     string `json:"circuit"`
}

type CircuitGetRequest struct {
	UserId int `json:"user_id"`
}

type Pair struct {
	CircuitName string
	Circuit     string
}

func (h *DBHandler) RegistrationHandler(resp http.ResponseWriter, req *http.Request) {
	config.DbLogger.Println("User registration request")

	var regReq RegistrationRequest
	err := json.NewDecoder(req.Body).Decode(&regReq)
	if err != nil {
		config.DbLogger.Println("User registration request: " + err.Error())
		http.Error(resp, "Invalid request body", http.StatusBadRequest)
		return
	}

	id, err := h.db.CreateUser(regReq.Name, regReq.Email, regReq.Password)
	if err != nil {
		config.DbLogger.Println("User registration request: " + err.Error())
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		return
	}

	config.DbLogger.Println("User registration request completed")
	resp.Header().Set("Content-Type", "application/json")
	resp.WriteHeader(http.StatusCreated)
	json.NewEncoder(resp).Encode(map[string]int{"user_id": id})
}

func (h *DBHandler) LoginHandler(resp http.ResponseWriter, req *http.Request) {
	config.DbLogger.Println("User login request")

	var logReq LoginRequest
	err := json.NewDecoder(req.Body).Decode(&logReq)
	if err != nil {
		config.DbLogger.Println("User login request: " + err.Error())
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	id, err := h.db.GetUser(logReq.Email, logReq.Password)
	if err != nil {
		config.DbLogger.Println("User login request: " + err.Error())
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	config.DbLogger.Println("User login request completed")
	resp.Header().Set("Content-Type", "application/json")
	json.NewEncoder(resp).Encode(map[string]int{"user_id": id})
}

func (h *DBHandler) CircuitsHandler(resp http.ResponseWriter, req *http.Request) {
	config.DbLogger.Println("User circuits request")

	switch req.Method {
	case http.MethodPost:
		var circuitPostReq CircuitPostRequest
		err := json.NewDecoder(req.Body).Decode(&circuitPostReq)
		if err != nil {
			config.DbLogger.Println("Circuit save request: " + err.Error())
			http.Error(resp, err.Error(), http.StatusBadRequest)
			return
		}
		err = h.db.SaveCircuits(circuitPostReq.UserId, circuitPostReq.CircuitName, circuitPostReq.Circuit)
		if err != nil {
			config.DbLogger.Println("Circuit saving request: " + err.Error())
			http.Error(resp, err.Error(), http.StatusBadRequest)
			return
		}

		config.DbLogger.Println("Circuit saving request completed")
		resp.WriteHeader(http.StatusCreated)
	case http.MethodGet:

		var circuitGetReq CircuitGetRequest
		err := json.NewDecoder(req.Body).Decode(&circuitGetReq)
		if err != nil {
			config.DbLogger.Println("Circuit getting request: " + err.Error())
			http.Error(resp, err.Error(), http.StatusBadRequest)
		}

		circuits, err := h.db.GetCircuit(circuitGetReq.UserId)

		config.DbLogger.Println("Circuits getting request completed")
		resp.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(resp).Encode(circuits)
	}
}
