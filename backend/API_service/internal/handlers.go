package internal

import (
	"API_service/config"
	"bytes"
	"io"
	"net/http"
)

func AuthenticationHandler(w http.ResponseWriter, r *http.Request, path string) {

	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	req, err := http.NewRequest(http.MethodPost, config.AuthServiceURL+path, bytes.NewReader(reqBody))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	req.Header = r.Header.Clone()

	resp, err := config.Client.Do(req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	for key, value := range resp.Header {
		for _, value := range value {
			w.Header().Add(key, value)
		}
	}

	w.WriteHeader(resp.StatusCode)
	w.Write(respBody)
}

func ProxyAuthHandler(w http.ResponseWriter, r *http.Request) {
	var path string

	switch r.URL.Path {
	case "/user/register":
		path = "/user/register"
	case "/user/login":
		path = "/user/login"
	}

	AuthenticationHandler(w, r, path)
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
