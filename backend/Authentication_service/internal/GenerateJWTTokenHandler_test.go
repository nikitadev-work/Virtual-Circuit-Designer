package internal

import (
	"Authentication_service/config"
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestGenerateJWTTokenHandler(t *testing.T) {
	config.AuthLogger = log.New(os.Stdout, "", log.LstdFlags)

	reqBody := map[string]interface{}{
		"user_id":    1,
		"user_name":  "ivan",
		"user_email": "ivanov@mail.com",
	}

	jsonData, _ := json.Marshal(reqBody)
	req, _ := http.NewRequest("POST", "/auth/generate-token", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GenerateJWTTokenHandler)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Expected status code: 200, got: %d", status)
	}

	authHeader := rr.Header().Get("Authorization")
	if authHeader == "" {
		t.Fatal("Handler did not set Autorization header")
	}

	tokenString := authHeader[len("Bearer "):]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret_key), nil
	}, jwt.WithLeeway(5*time.Second))

	if err != nil {
		t.Fatalf("Failed to parse token: %v", err)
	}

	if !token.Valid {
		t.Fatal("Token is invalid")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		t.Fatal("failed to parse token claims")
	}

	if claims["user_id"] != "1" {
		t.Errorf("user_id in token does not match: got %v want %v", claims["user_id"], "1")
	}

	if claims["user_name"] != "ivan" {
		t.Errorf("user_name in token does not match: got %v want %v", claims["user_name"], "testuser")
	}

	if claims["user_email"] != "ivanov@mail.com" {
		t.Errorf("user_email in token does not match: got %v want %v", claims["user_email"], "test@example.com")
	}
}
