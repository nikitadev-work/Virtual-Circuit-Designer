//go:build integration

package internal

import (
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strconv"
	"strings"
	"testing"
	"time"

	"Authentication_service/config"

	"github.com/golang-jwt/jwt/v5"
)

func generateValidToken(userID int, userName, userEmail string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":    strconv.Itoa(userID),
		"user_name":  userName,
		"user_email": userEmail,
		"exp":        time.Now().Add(1 * time.Hour).Unix(),
	})

	tokenString, _ := token.SignedString([]byte(secret_key))
	return tokenString
}

func TestCheckJWTTokenHandler_ValidToken(t *testing.T) {
	config.AuthLogger = log.New(os.Stdout, "", log.LstdFlags)

	token := generateValidToken(123, "JohnDoe", "john@example.com")
	req := httptest.NewRequest(http.MethodGet, "/check", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	rr := httptest.NewRecorder()

	CheckJWTTokenHandler(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("Expected status 200 OK, got %d", rr.Code)
	}

	var resp Resp
	if err := json.NewDecoder(rr.Body).Decode(&resp); err != nil {
		t.Fatalf("Failed to decode response body: %v", err)
	}

	if resp.UserID != 123 {
		t.Errorf("Expected UserID 123, got %d", resp.UserID)
	}
	if resp.UserName != "JohnDoe" {
		t.Errorf("Expected UserName 'JohnDoe', got '%s'", resp.UserName)
	}
	if resp.UserEmail != "john@example.com" {
		t.Errorf("Expected UserEmail 'john@example.com', got '%s'", resp.UserEmail)
	}
}

func TestCheckJWTTokenHandler_MissingAuthorizationHeader(t *testing.T) {
	config.AuthLogger = log.New(os.Stdout, "", log.LstdFlags)

	req := httptest.NewRequest(http.MethodGet, "/check", nil)
	rr := httptest.NewRecorder()

	CheckJWTTokenHandler(rr, req)

	if rr.Code != http.StatusUnauthorized {
		t.Fatalf("Expected status 401 Unauthorized, got %d", rr.Code)
	}

	if !strings.Contains(rr.Body.String(), "Missing Authorization header") {
		t.Errorf("Unexpected error message: %s", rr.Body.String())
	}
}

func TestCheckJWTTokenHandler_InvalidToken(t *testing.T) {
	config.AuthLogger = log.New(os.Stdout, "", log.LstdFlags)

	req := httptest.NewRequest(http.MethodGet, "/check", nil)
	req.Header.Set("Authorization", "Bearer invalid.token.string")

	rr := httptest.NewRecorder()
	CheckJWTTokenHandler(rr, req)

	if rr.Code != http.StatusUnauthorized {
		t.Fatalf("Expected status 401 Unauthorized, got %d", rr.Code)
	}

	if !strings.Contains(rr.Body.String(), "Invalid token") {
		t.Errorf("Unexpected error message: %s", rr.Body.String())
	}
}

func TestCheckJWTTokenHandler_ExpiredToken(t *testing.T) {
	config.AuthLogger = log.New(os.Stdout, "", log.LstdFlags)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":    "123",
		"user_name":  "JohnDoe",
		"user_email": "john@example.com",
		"exp":        time.Now().Add(-1 * time.Hour).Unix(),
	})

	tokenString, _ := token.SignedString([]byte(secret_key))

	req := httptest.NewRequest(http.MethodGet, "/check", nil)
	req.Header.Set("Authorization", "Bearer "+tokenString)

	rr := httptest.NewRecorder()
	CheckJWTTokenHandler(rr, req)

	if rr.Code != http.StatusUnauthorized {
		t.Fatalf("Expected status 401 Unauthorized, got %d", rr.Code)
	}

	if !strings.Contains(rr.Body.String(), "Token expired") {
		t.Errorf("Unexpected error message: %s", rr.Body.String())
	}
}
