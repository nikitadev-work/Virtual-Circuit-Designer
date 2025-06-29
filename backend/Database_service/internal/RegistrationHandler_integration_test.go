//go:build integration

package internal

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"

	_ "github.com/lib/pq"
)

func TestRegistrationHandler_Integration(t *testing.T) {
	ctx := context.Background()

	req := testcontainers.ContainerRequest{
		Image:        "postgres:15",
		ExposedPorts: []string{"5432/tcp"},
		Env: map[string]string{
			"POSTGRES_USER":     "vcddbuser",
			"POSTGRES_PASSWORD": "vcddbpassword",
			"POSTGRES_DB":       "vcddbname",
		},
		WaitingFor: wait.ForAll(
			wait.ForLog("database system is ready to accept connections"),
			wait.ForListeningPort("5432/tcp"),
		).WithStartupTimeout(2 * time.Minute),
	}

	postgresContainer, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: req,
		Started:          true,
	})
	if err != nil {
		t.Fatal(err)
	}
	defer postgresContainer.Terminate(ctx)

	host, err := postgresContainer.Host(ctx)
	if err != nil {
		t.Fatal(err)
	}

	port, err := postgresContainer.MappedPort(ctx, "5432")
	if err != nil {
		t.Fatal(err)
	}

	time.Sleep(1 * time.Second)

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port.Port(), "vcddbuser", "vcddbpassword", "vcddbname")

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	ctxPing, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctxPing); err != nil {
		t.Fatal("Failed to ping DB:", err)
	}

	if err := db.Ping(); err != nil {
		t.Fatal(err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL
		)`)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Exec("TRUNCATE TABLE users")

	postgresDB := NewPostgresDB(connStr)
	handler := NewDBHandler(postgresDB)

	regReq := RegistrationRequest{
		Name:     "Ivan",
		Email:    "ivanov@mail.com",
		Password: "ivan2052",
	}
	bodyJson, _ := json.Marshal(regReq)
	reqHTTP := httptest.NewRequest("POST", "/register", bytes.NewBuffer(bodyJson))
	reqHTTP.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	handler.RegistrationHandler(resp, reqHTTP)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected status 200, got: %v", resp.Code)
	}

	var response LogRegResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatal(err)
	}

	if response.Email != regReq.Email || response.Name != regReq.Name {
		t.Errorf("Response data mismatch. Expected %v, got %v", regReq, response)
	}

	var dbUser struct {
		ID    int
		Name  string
		Email string
	}
	err = db.QueryRow("SELECT id, name, email FROM users WHERE email = $1", regReq.Email).
		Scan(&dbUser.ID, &dbUser.Name, &dbUser.Email)
	if err != nil {
		t.Fatal("User not found in DB:", err)
	}

	if dbUser.ID != response.Id {
		t.Errorf("DB user ID mismatch. Expected %d, got %d", response.Id, dbUser.ID)
	}
}
