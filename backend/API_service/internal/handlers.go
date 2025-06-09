package internal

import "net/http"

func RegistrationHandler(w http.ResponseWriter, r *http.Request) {
	_, write := w.Write([]byte("Registration"))
	if write != nil {
		return
	}
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	_, write := w.Write([]byte("Login"))
	if write != nil {
		return
	}
}

func CircuitsHandler(w http.ResponseWriter, r *http.Request) {
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
