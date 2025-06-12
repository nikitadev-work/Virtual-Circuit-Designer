package handlers

import (
	"Database_service/internal/storage"
	"encoding/json"
	"net/http"

	_ "github.com/lib/pq"
)

type DBHandler struct {
	db *storage.PostgresDB
}

func NewDBHandler(db *storage.PostgresDB) *DBHandler {
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
	User_id      int    `json:"user_id"`
	Circuit_name string `json:"circuit_name"`
	Circuit      string `json:"circuit"`
}

type CircuitGetRequest struct {
	User_id int `json:"user_id"`
}

type Pair struct {
	Circuit_name string
	Circuit      string
}

func (h *DBHandler) RegistrationHandler(resp http.ResponseWriter, req *http.Request) {
	var regReq RegistrationRequest
	err := json.NewDecoder(req.Body).Decode(&regReq)
	if err != nil {
		http.Error(resp, "Invalid request body", http.StatusBadRequest)
		return
	}

	id, err := h.db.CreateUser(regReq.Name, regReq.Email, regReq.Password)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		return
	}

	resp.Header().Set("Content-Type", "application/json")
	resp.WriteHeader(http.StatusCreated)
	json.NewEncoder(resp).Encode(map[string]int{"id": id})
}
func (h *DBHandler) LoginHandler(resp http.ResponseWriter, req *http.Request) {
	var logReq LoginRequest
	err := json.NewDecoder(req.Body).Decode(&logReq)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	id, err := h.db.GetUser(logReq.Email, logReq.Password)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	resp.Header().Set("Content-Type", "application/json")
	json.NewEncoder(resp).Encode(map[string]int{"id": id})
}
func (h *DBHandler) CircuitsHandler(resp http.ResponseWriter, req *http.Request) {
	switch req.Method {
	case http.MethodPost:
		var circuitPostReq CircuitPostRequest
		err := json.NewDecoder(req.Body).Decode(&circuitPostReq)
		if err != nil {
			http.Error(resp, err.Error(), http.StatusBadRequest)
			return
		}
		err = h.db.SaveCircuits(circuitPostReq.User_id, circuitPostReq.Circuit_name, circuitPostReq.Circuit)
		if err != nil {
			http.Error(resp, err.Error(), http.StatusBadRequest)
			return
		}
		resp.WriteHeader(http.StatusCreated)
	case http.MethodGet:
		var circuitGetReq CircuitGetRequest
		err := json.NewDecoder(req.Body).Decode(&circuitGetReq)
		if err != nil {
			http.Error(resp, err.Error(), http.StatusBadRequest)
		}

		circuits, err := h.db.GetCircuit(circuitGetReq.User_id)

		resp.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(resp).Encode(circuits)
	}
}
