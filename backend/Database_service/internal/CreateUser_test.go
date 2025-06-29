package internal

import (
	"Database_service/config"
	"log"
	"os"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestCreateUser(t *testing.T) {
	config.DbLogger = log.New(os.Stdout, "", log.LstdFlags)
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("Failed to create mock DB: %v", err)
	}

	mock.ExpectExec("insert into Users \\(id, name, email, password\\) values \\(\\$1, \\$2, \\$3, \\$4\\)").
		WithArgs(1, "ivan", "ivanov@mail.com", "ivan52").
		WillReturnResult(sqlmock.NewResult(1, 1))
	postgresDB := &PostgresDB{conn: db}

	userID, err := postgresDB.CreateUser("ivan", "ivanov@mail.com", "ivan52")
	if err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}

	if userID != 1 {
		t.Errorf("Expected userID = 1, got: %d", userID)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("Unfulfilled expectations: %v", err)
	}
}
