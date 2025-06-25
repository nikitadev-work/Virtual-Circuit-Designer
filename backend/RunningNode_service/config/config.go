package config

import (
	"log"
	"os"
)

var RNLogger *log.Logger

func ConfigureLogger() {
	RNLogger = log.New(os.Stdout, "LOGGER: ", log.LstdFlags)
}
