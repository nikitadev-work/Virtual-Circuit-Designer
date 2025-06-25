package config

import (
	"log"
	"os"
)

var DbLogger *log.Logger

func ConfigureLogger() {
	DbLogger = log.New(os.Stdout, "LOGGER: ", log.LstdFlags)
}
