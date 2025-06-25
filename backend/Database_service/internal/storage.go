package internal

import (
	"Database_service/config"
	"database/sql"
	"errors"
	"fmt"

	_ "github.com/lib/pq"
)

// Example of user data
type User struct {
	id       int
	name     string
	email    string
	password string
}

type Circuit struct {
	id          int
	userId      int
	circuitName string
	circuit     string
}

type PostgresDB struct {
	conn *sql.DB
}

var userId int
var circuitID int

func NewPostgresDB() *PostgresDB {
	config.DbLogger.Println("Connecting to database")
	connStr := "host=database user=vcddbuser password=vcddbpassword dbname=vcddbname sslmode=disable"
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
			"circuit VARCHAR(100) NOT NULL)")
	if err != nil {
		return err
	}

	config.DbLogger.Println("Created tables")
	return nil
}

func (db *PostgresDB) CreateUser(username, email, password string) (int, error) {
	config.DbLogger.Println("Creating user")
	userId += 1
	_, err := db.conn.Exec(
		"insert into Users (id, name, email, password) "+
			"values ($1, $2, $3, $4)", userId, username, email, password)

	if err != nil {
		return 0, err
	}

	config.DbLogger.Println("Created user")
	return userId, nil
}

func (db *PostgresDB) GetUser(email, password string) (int, error) {
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
		return 0, fmt.Errorf("User with email '%s' not found", email)
	case err != nil:
		config.DbLogger.Println("Error getting user")
		return 0, fmt.Errorf("Database error: '%v'", err)
	default:
		config.DbLogger.Printf("User found")
		return foundUser.id, nil
	}
}

func (db *PostgresDB) SaveCircuits(userId int, circuitName, circuit string) error {
	config.DbLogger.Println("Saving circuits")
	circuitID += 1
	_, err := db.conn.Exec(
		"Insert into Circuits (id, user_id, name_of_scheme, scheme)"+
			" values ($1, $2, $3, $4)", circuitID, userId, circuitName, circuit)
	if err != nil {
		return err
	}

	return nil
}

func (db *PostgresDB) GetCircuit(userId int) ([]Pair, error) {
	config.DbLogger.Println("Getting circuits")

	query := "Select * FROM Circuits WHERE user_id = $1"
	rows, err := db.conn.Query(query, userId)
	if err != nil {
		config.DbLogger.Println("Error getting circuits")
		return []Pair{}, err
	}

	var circuitsFound []Pair
	for rows.Next() {
		var c Circuit
		var temp Pair
		err := rows.Scan(&c.id, &c.userId, &c.circuitName, &c.circuit)
		if err != nil {
			config.DbLogger.Println("Error getting circuits")
			return []Pair{}, err
		}
		temp.CircuitName = c.circuitName
		temp.Circuit = c.circuit
		circuitsFound = append(circuitsFound, temp)
	}

	config.DbLogger.Println("Got circuits")
	return circuitsFound, nil
}
