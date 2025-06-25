package RunningNode_service

import (
	"RunningNode_service/internal"
	"net/http"
)

func main() {
	http.HandleFunc("/circuits/simulate", internal.SimulateHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		return
	}
}
