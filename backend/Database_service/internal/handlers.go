package internal

import (
	"Database_service/config"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	_ "github.com/lib/pq"
)

type DBHandler struct {
	db *PostgresDB
}

func NewDBHandler(db *PostgresDB) *DBHandler {
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
	UserId             int      `json:"user_id"`
	CircuitName        string   `json:"circuit_name"`
	Circuit            [][3]any `json:"circuit_description"`
	CircuitInputs      []int    `json:"circuit_inputs"`
	CircuitCoordinates [][]any  `json:"circuit_coordinates"`
}

type CircuitGetRequest struct {
	UserId int `json:"user_id"`
}

type LogRegResponse struct {
	Id    int    `json:"user_id"`
	Name  string `json:"user_name"`
	Email string `json:"user_email"`
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

	id, _, err := h.db.GetUser(regReq.Email, "")
	if id != 0 {
		config.DbLogger.Println("User with current email already exists")
		http.Error(resp, "User with current email already exists", http.StatusBadRequest)
		return
	}

	id, err = h.db.CreateUser(regReq.Name, regReq.Email, regReq.Password)
	if err != nil {
		config.DbLogger.Println("User registration request: " + err.Error())
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		return
	}

	var regResponse LogRegResponse
	regResponse.Id = id
	regResponse.Name = regReq.Name
	regResponse.Email = regReq.Email

	config.DbLogger.Println("User registration request completed")
	resp.Header().Set("Content-Type", "application/json")
	resp.WriteHeader(http.StatusOK)
	json.NewEncoder(resp).Encode(regResponse)
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

	id, name, err := h.db.GetUser(logReq.Email, logReq.Password)
	if err != nil {
		config.DbLogger.Println("User login request: " + err.Error())
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	var logResponse LogRegResponse
	logResponse.Id = id
	logResponse.Name = name
	logResponse.Email = logReq.Email

	config.DbLogger.Println("User login request completed")
	resp.Header().Set("Content-Type", "application/json")
	resp.WriteHeader(http.StatusOK)
	json.NewEncoder(resp).Encode(logResponse)
}

func (h *DBHandler) CircuitsHandler(resp http.ResponseWriter, req *http.Request) {
	switch req.Method {
	case http.MethodPost:
		config.DbLogger.Println("Circuit save request")
		var circuitPostReq CircuitPostRequest
		err := json.NewDecoder(req.Body).Decode(&circuitPostReq)
		if err != nil {
			config.DbLogger.Println("Error while circuit save request: " + err.Error())
			http.Error(resp, err.Error(), http.StatusBadRequest)
			return
		}

		circuitId, userId, err := h.db.SaveCircuits(circuitPostReq.UserId, circuitPostReq.CircuitName, circuitPostReq.Circuit,
			circuitPostReq.CircuitInputs, circuitPostReq.CircuitCoordinates)
		if err != nil {
			config.DbLogger.Println("Circuit saving request: " + err.Error())
			http.Error(resp, err.Error(), http.StatusBadRequest)
			return
		}

		var apiResp struct {
			CircuitID int `json:"circuit_id"`
			CserID    int `json:"user_id"`
		}

		apiResp.CircuitID = circuitId
		apiResp.CserID = userId

		config.DbLogger.Println("Circuit saving request completed")
		resp.Header().Set("Content-Type", "applicatin/json")
		resp.WriteHeader(http.StatusCreated)
		json.NewEncoder(resp).Encode(apiResp)

	case http.MethodGet:
		userID, err := strconv.Atoi(req.URL.Query().Get("user_id"))
		if err != nil {
			config.DbLogger.Println("Invalid user_id in circuit request")
			http.Error(resp, "Invalid user_id", http.StatusBadRequest)
			return
		}

		circuits, err := h.db.GetCircuits(userID)
		if err != nil {
			config.DbLogger.Println("Error retrieving circuits: " + err.Error())
			http.Error(resp, "Error retrieving circuits", http.StatusInternalServerError)
			return
		}

		if circuits == nil {
			circuits = []Circuit{}
		}

		config.DbLogger.Println("Circuits getting request completed")
		resp.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(resp).Encode(circuits)
		if err != nil {
			config.DbLogger.Println("Error while writing response for circuits get request")
			http.Error(resp, "Error while writing response for circuits get request", http.StatusInternalServerError)
			return
		}
	}
}

func (h *DBHandler) CircuitByIDHandler(resp http.ResponseWriter, req *http.Request) {
	switch req.Method {
	case http.MethodGet:
		config.DbLogger.Println("User circuit by ID request")

		pathParts := strings.Split(req.URL.Path, "/")
		if len(pathParts) < 3 {
			http.Error(resp, "Invalid circuit ID", http.StatusBadRequest)
			return
		}

		circuitID, err := strconv.Atoi(pathParts[2])
		if err != nil {
			http.Error(resp, "Circuit ID must be a number", http.StatusBadRequest)
			return
		}

		userID, err := strconv.Atoi(req.URL.Query().Get("user_id"))
		if err != nil {
			http.Error(resp, "Invalid user_id", http.StatusBadRequest)
			return
		}

		circuit, err := h.db.GetCircuitByID(userID, circuitID)
		if err != nil {
			config.DbLogger.Println("Error while getting circuit by ID from DB")
			http.Error(resp, "Error while getting circuit by ID from DB", http.StatusInternalServerError)
			return
		}

		config.DbLogger.Println("Circuits getting request completed")
		resp.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(resp).Encode(circuit)
		if err != nil {
			config.DbLogger.Println("Error while writing response for circuit by ID get request")
			http.Error(resp, "Error while writing response for circuit by ID get request", http.StatusInternalServerError)
			return
		}
	case http.MethodDelete:
		config.DbLogger.Println("User circuit delete request")
		pathParts := strings.Split(req.URL.Path, "/")
		if len(pathParts) < 3 {
			http.Error(resp, "Invalid circuit ID", http.StatusBadRequest)
		}
		circuitID, err := strconv.Atoi(pathParts[2])
		if err != nil {
			http.Error(resp, "Circuit ID must be a number", http.StatusBadRequest)
			return
		}
		userID, err := strconv.Atoi(req.URL.Query().Get("user_id"))
		if err != nil {
			http.Error(resp, "Invalid user_id", http.StatusBadRequest)
			return
		}
		err = h.db.DeleteCircuitByID(userID, circuitID)
		if err != nil {
			resp.WriteHeader(http.StatusInternalServerError)
		} else {
			resp.WriteHeader(http.StatusOK)
		}
	default:
		config.DbLogger.Println("This method is not allowed: ", req.Method)
		resp.WriteHeader(http.StatusBadRequest)
	}
}
