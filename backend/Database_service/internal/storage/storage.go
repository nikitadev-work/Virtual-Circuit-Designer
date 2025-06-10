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
	circuits []string
}

type Database interface {
	CreateUser(username, email, password string) error
	GetUserByEmail(email string) (User, error)
}

type postgresDB struct {
	conn *sql.DB
}

var id int

func NewPostgresDB() *postgresDB {
	connStr := "" // user, password, dbname etc.
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	return &postgresDB{conn: db}
}

func (db *postgresDB) CreateUser(username, email, password string) error {
	_, err := db.conn.Exec("insert into Users (id, name, email, password, circuits) values ($1, $2, $3, $4, $5)", id, username, email, password, []string{})
	if err == nil {
		id += 1
	}
	return err
}

func (db *postgresDB) GetUserByEmail(email string) (User, error) {
	query := "Select id, name, email, password, circuits FROM Users WHERE email = $1"
	row := db.conn.QueryRow(query, email)

	var NotFoundUser User
	var foundUser User
	err := row.Scan(&foundUser.id, &foundUser.name, &foundUser.email, &foundUser.password, &foundUser.circuits)

	switch {
	case err == sql.ErrNoRows:
		return NotFoundUser, fmt.Errorf("User with email '%s' not found", email)
	case err != nil:
		return NotFoundUser, fmt.Errorf("Database error: '%v'", err)
	default:
		return foundUser, err
	}
}
