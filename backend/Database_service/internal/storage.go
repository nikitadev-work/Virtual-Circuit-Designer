package internal

import (
	"Database_service/config"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"

	_ "github.com/lib/pq"
)

type User struct {
	id       int
	name     string
	email    string
	password string
}

type Circuit struct {
	ID          int      `json:"id"`
	UserID      int      `json:"user_id"`
	CircuitName string   `json:"name"`
	Circuit     [][3]any `json:"circuit"`
}

type PostgresDB struct {
	conn *sql.DB
}

func NewPostgresDB(connStr string) *PostgresDB {
	config.DbLogger.Println("Connecting to database")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}

	config.DbLogger.Println("Connected to database")
	return &PostgresDB{conn: db}
}

func (db *PostgresDB) CreateTables() error {
	config.DbLogger.Println("Creating tables")

	_, err := db.conn.Exec(
		"CREATE TABLE IF NOT EXISTS users " +
			"(id SERIAL PRIMARY KEY, " +
			"name VARCHAR(100) NOT NULL, " +
			"email VARCHAR(100) NOT NULL, " +
			"password VARCHAR(100) NOT NULL)")
	if err != nil {
		return err
	}

	_, err = db.conn.Exec(
		"CREATE TABLE IF NOT EXISTS circuits " +
			"(id SERIAL PRIMARY KEY, " +
			"user_id INTEGER NOT NULL, " +
			"name VARCHAR(100) NOT NULL, " +
			"circuit JSONB NOT NULL)")
	if err != nil {
		return err
	}

	config.DbLogger.Println("Created tables")
	return nil
}

func (db *PostgresDB) CreateUser(username, email, password string) (int, error) {
	config.DbLogger.Println("Creating user")
	_, err := db.conn.Exec(
		"insert into Users (name, email, password) "+
			"values ($1, $2, $3)", username, email, password)

	if err != nil {
		return 0, err
	}
	userID, _, _ := db.GetUser(email, password)
	config.DbLogger.Println("Created user")
	return userID, nil
}

func (db *PostgresDB) GetUser(email, password string) (int, string, error) {
	config.DbLogger.Println("Getting user")

	query := "Select id, name, email, password FROM Users WHERE email = $1"
	args := []interface{}{email}

	if password != "" {
		query += " AND password = $2"
		args = append(args, password)
	}

	row := db.conn.QueryRow(query, args...)

	var foundUser User
	err := row.Scan(&foundUser.id, &foundUser.name, &foundUser.email, &foundUser.password)

	switch {
	case errors.Is(err, sql.ErrNoRows):
		config.DbLogger.Println("User not found")
		return 0, "", fmt.Errorf("User with email '%s' not found", email)
	case err != nil:
		config.DbLogger.Println("Error getting user")
		return 0, "", fmt.Errorf("Database error: '%v'", err)
	default:
		config.DbLogger.Printf("User found")
		return foundUser.id, foundUser.name, nil
	}
}

func (db *PostgresDB) SaveCircuits(userId int, circuitName string, circuit [][3]any) error {
	config.DbLogger.Println("Saving circuits")

	circuitJSON, err := json.Marshal(circuit)
	if err != nil {
		return err
	}

	_, err = db.conn.Exec(
		"Insert into Circuits (user_id, name, circuit)"+
			" values ($1, $2, $3)", userId, circuitName, string(circuitJSON))
	if err != nil {
		config.DbLogger.Println("Error while saving circuits: ", err)
		return err
	}

	return nil
}

func (db *PostgresDB) GetCircuits(userId int) ([]Circuit, error) {
	config.DbLogger.Println("Getting all circuits of user with id: ", userId)

	query := "Select * FROM Circuits WHERE user_id = $1"
	rows, err := db.conn.Query(query, userId)
	if err != nil {
		config.DbLogger.Println("Error getting circuits")
		return []Circuit{}, err
	}

	var circuitsFound []Circuit
	for rows.Next() {
		var c Circuit
		var circuitJSON []byte

		err := rows.Scan(&c.ID, &c.UserID, &c.CircuitName, &circuitJSON)
		if err != nil {
			config.DbLogger.Println("Error scanning circuit:", err)
			return nil, err
		}

		if err := json.Unmarshal(circuitJSON, &c.Circuit); err != nil {
			config.DbLogger.Println("Error unmarshaling circuit JSON:", err)
			return nil, err
		}
		circuitsFound = append(circuitsFound, c)
	}

	config.DbLogger.Println("Got all circuits of user")
	return circuitsFound, nil
}

func (db *PostgresDB) GetCircuit(userId, circuitId int) (Circuit, error) {
	config.DbLogger.Println("Getting one circuit for user_id: ", userId)
	query := "Select * FROM Circuits WHERE id = $1 AND user_id = $2"

	var c Circuit
	var circuitJSON []byte

	err := db.conn.QueryRow(query, userId, circuitId).Scan(
		&c.ID,
		&c.UserID,
		&c.CircuitName,
		&circuitJSON,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			config.DbLogger.Printf("Circuit %d not found for user %d", circuitId, userId)
			return Circuit{}, fmt.Errorf("circuit not found")
		}
		config.DbLogger.Printf("Error scanning circuit: %v", err)
		return Circuit{}, fmt.Errorf("database error: %v", err)
	}

	if err := json.Unmarshal(circuitJSON, &c.Circuit); err != nil {
		config.DbLogger.Println("Error unmarshaling circuit JSON:", err)
		return Circuit{}, err
	}
	config.DbLogger.Println("Got circuit")
	return c, nil
}
