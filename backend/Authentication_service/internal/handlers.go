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
