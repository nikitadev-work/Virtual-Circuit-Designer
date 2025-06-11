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

type PostgresDB struct {
	conn *sql.DB
}

var id int

func NewPostgresDB() *PostgresDB {
	connStr := "" // user, password, dbname etc.
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}

	return &PostgresDB{conn: db}
}

func (db *PostgresDB) CreateUser(username, email, password string) (int, error) {
	id += 1
	_, err := db.conn.Exec("insert into Users (id, name, email, password) values ($1, $2, $3, $4)", id, username, email, password)
	return id, err
}

func (db *PostgresDB) GetUserByEmail(email string) (User, error) {
	query := "Select id, name, email, password, circuits FROM Users WHERE email = $1"
	row := db.conn.QueryRow(query, email)

	var NotFoundUser User
	var foundUser User
	err := row.Scan(&foundUser.id, &foundUser.name, &foundUser.email, &foundUser.password)

	switch {
	case err == sql.ErrNoRows:
		return NotFoundUser, fmt.Errorf("User with email '%s' not found", email)
	case err != nil:
		return NotFoundUser, fmt.Errorf("Database error: '%v'", err)
	default:
		return foundUser, err
	}
}
