package internal

import (
	"Authentication_service/config"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secret_key = "our-secret-key"

type Resp struct {
	UserID    int    `json:"user_id"`
	UserName  string `json:"user_name"`
	UserEmail string `json:"user_email"`
}

type Claims struct {
	UserID    string `json:"user_id"`
	UserName  string `json:"user_name"`
	UserEmail string `json:"user_email"`
	jwt.RegisteredClaims
}

func CheckJWTTokenHandler(w http.ResponseWriter, r *http.Request) {
	config.AuthLogger.Println("Token verification request")

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		config.AuthLogger.Println("Token verification request: No Authorization header found")
		http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		config.AuthLogger.Println("Token verification request: Invalid Authorization header")
		http.Error(w, "Invalid Authorization header", http.StatusUnauthorized)
		return
	}

	tokenString := parts[1]

	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			config.AuthLogger.Println("Token verification request: Unexpected signing method")
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(secret_key), nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			config.AuthLogger.Println("Token verification request: Token expired")
			http.Error(w, "Token expired", http.StatusUnauthorized)
			return
		}
		config.AuthLogger.Println("Token verification request: Invalid token")
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	if !token.Valid {
		config.AuthLogger.Println("Token verification request: Invalid token")
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	if claims.UserID == "" {
		config.AuthLogger.Println("Token verification request: Empty user ID")
		http.Error(w, "Invalid token: missing user_id", http.StatusUnauthorized)
		return
	}

	if claims.UserName == "" {
		config.AuthLogger.Println("Token verification request: Empty user Name")
		http.Error(w, "Invalid token: missing user_email", http.StatusUnauthorized)
		return
	}

	if claims.UserEmail == "" {
		config.AuthLogger.Println("Token verification request: Empty user Email")
		http.Error(w, "Invalid token: missing user_email", http.StatusUnauthorized)
		return
	}

	id, _ := strconv.Atoi(claims.UserID)
	resp := Resp{
		UserID:    id,
		UserName:  claims.UserName,
		UserEmail: claims.UserEmail,
	}

	config.AuthLogger.Println("Token verification request: Request completed successfully")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}

func GenerateJWTTokenHandler(w http.ResponseWriter, r *http.Request) {
	config.AuthLogger.Println("Token generation request")

	var req struct {
		UserID    int    `json:"user_id"`
		UserName  string `json:"user_name"`
		UserEmail string `json:"user_email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		config.AuthLogger.Println("Token generation request: " + err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":    strconv.Itoa(req.UserID),
		"user_name":  req.UserName,
		"user_email": req.UserEmail,
		"exp":        time.Now().Add(168 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(secret_key))
	if err != nil {
		config.AuthLogger.Println("Token generation request: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	config.AuthLogger.Println("Token generation request: Generated JWT successfully")
	w.Header().Set("Authorization", "Bearer "+tokenString)
	w.WriteHeader(http.StatusOK)
}
