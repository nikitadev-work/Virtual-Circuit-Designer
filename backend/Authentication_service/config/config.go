package config

import (
	"log"
	"os"
)

var AuthLogger *log.Logger

func ConfigureLogger() {
	AuthLogger = log.New(os.Stdout, "LOGGER: ", log.LstdFlags)
}
