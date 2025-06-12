package storage

import (
	"database/sql"
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
	id           int
	user_id      int
	circuit_name string
	circuit      string
}

type PostgresDB struct {
	conn *sql.DB
}

type Pair struct {
	Circuit_name string `json:"circuit_name"`
	Circuit      string `json:"circuit"`
}

var userId int
var circuitID int

func NewPostgresDB() *PostgresDB {
	connStr := "" // user, password, dbname etc.
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}

	return &PostgresDB{conn: db}
}

func (db *PostgresDB) CreateUser(username, email, password string) (int, error) {
	userId += 1
	_, err := db.conn.Exec("insert into Users (id, name, email, password) values ($1, $2, $3, $4)", userId, username, email, password)
	return userId, err
}

func (db *PostgresDB) GetUser(email, password string) (int, error) {
	query := "Select id, name, email, password, circuits FROM Users WHERE email = $1 AND password = $2"
	row := db.conn.QueryRow(query, email, password)

	var foundUser User
	err := row.Scan(&foundUser.id, &foundUser.name, &foundUser.email, &foundUser.password)

	switch {
	case err == sql.ErrNoRows:
		return 0, fmt.Errorf("User with email '%s' not found", email)
	case err != nil:
		return 0, fmt.Errorf("Database error: '%v'", err)
	default:
		return foundUser.id, err
	}
}

func (db *PostgresDB) SaveCircuits(user_id int, circuit_name, circuit string) error {
	circuitID += 1
	_, err := db.conn.Exec("Insert into Circuits (id, user_id, name_of_scheme, scheme) values ($1, $2, $3, $4)", circuitID, user_id, circuit_name, circuit)
	return err
}

func (db *PostgresDB) GetCircuit(user_id int) ([]Pair, error) {
	query := "Select * FROM Circuits WHERE user_id = $1"
	rows, err := db.conn.Query(query, user_id)
	if err != nil {
		return []Pair{}, err
	}

	var circuitsFound []Pair
	for rows.Next() {
		var c Circuit
		var temp Pair
		err := rows.Scan(&c.id, &c.user_id, &c.circuit_name, &c.circuit)
		if err != nil {
			return []Pair{}, err
		}
		temp.Circuit_name = c.circuit_name
		temp.Circuit = c.circuit
		circuitsFound = append(circuitsFound, temp)
	}

	return circuitsFound, nil
}
