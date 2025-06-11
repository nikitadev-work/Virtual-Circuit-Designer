package handlers

import (
	"Database_service/internal/storage"
	"net/http"
	"strconv"

	_ "github.com/lib/pq"
)

type DBHandler struct {
	db *storage.PostgresDB
}

func NewDBHandler(db *storage.PostgresDB) *DBHandler {
	return &DBHandler{db: db}
}

func (h *DBHandler) RegistrationHandler(resp http.ResponseWriter, req *http.Request) {
	name := req.URL.Query().Get("name")
	email := req.URL.Query().Get("email")
	password := req.URL.Query().Get("password")
	id, err := h.db.CreateUser(name, email, password)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		return
	}

	idStr := strconv.Itoa(id)
	resp.WriteHeader(http.StatusCreated)
	_, err = resp.Write([]byte(idStr))
	if err != nil {
		http.Error(resp, "Failed to write response", http.StatusInternalServerError)
		return
	}
}
func (h *DBHandler) LoginHandler(resp http.ResponseWriter, req *http.Request)    {}
func (h *DBHandler) CircuitsHandler(resp http.ResponseWriter, req *http.Request) {}
