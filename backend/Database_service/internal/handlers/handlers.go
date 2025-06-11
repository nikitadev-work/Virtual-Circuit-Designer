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
	json.NewEncoder(resp).Encode(map[string]int{"id": id})
}
func (h *DBHandler) LoginHandler(resp http.ResponseWriter, req *http.Request)    {}
func (h *DBHandler) CircuitsHandler(resp http.ResponseWriter, req *http.Request) {}
