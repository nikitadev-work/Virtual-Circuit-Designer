package internal

import (
	"RunningNode_service/config"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
)

var cntFiles int

func fileExist(filePath string) bool {
	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		return false
	}
	return true
}

func SimulateHandler(resp http.ResponseWriter, req *http.Request) {
	config.RNLogger.Println("Circuit simulation request")

	var requestData struct {
		Circuit       [][3]any `json:"circuit_description"`
		CircuitInputs []int    `json:"circuit_inputs"`
	}

	err := json.NewDecoder(req.Body).Decode(&requestData)

	if err != nil {
		config.RNLogger.Println("Circuit simulation request: ", err.Error())
		http.Error(resp, "Invalid request body", http.StatusBadRequest)
		return
	}

	cntFiles++
	// Creating scheme file
	dir := "./files"
	fileName := fmt.Sprintf("scheme%d.json", cntFiles)

	schemePath := filepath.Join(dir, fileName)

	file, err := os.Create(schemePath)

	if err != nil {
		config.RNLogger.Println("Failed to create JSON file: ", err.Error())
		http.Error(resp, "Failed to create JSON file", http.StatusInternalServerError)
		return
	}

	defer file.Close()

	jsonData, err := json.Marshal(requestData.Circuit)
	if err != nil {
		config.RNLogger.Println("Failed to encode circuit to JSON data: ", err.Error())
		http.Error(resp, "Failed to encode circuit to JSON data", http.StatusInternalServerError)
		return
	}

	_, err = file.Write(jsonData)
	if err != nil {
		config.RNLogger.Println("Falied to write json data to file: ", err.Error())
		http.Error(resp, "Falied to write json data to file", http.StatusInternalServerError)
		return
	}

	// Creating inputs file

	fileName = fmt.Sprintf("inputs%d.json", cntFiles)

	inputsPath := filepath.Join(dir, fileName)

	file, err = os.Create(inputsPath)

	if err != nil {
		config.RNLogger.Println("Failed to create JSON file: ", err.Error())
		http.Error(resp, "Failed to create JSON file", http.StatusInternalServerError)
		return
	}

	defer file.Close()

	jsonData, err = json.Marshal(requestData.CircuitInputs)
	if err != nil {
		config.RNLogger.Println("Failed to encode circuit to JSON data: ", err.Error())
		http.Error(resp, "Failed to encode circuit to JSON data", http.StatusInternalServerError)
		return
	}

	_, err = file.Write(jsonData)
	if err != nil {
		config.RNLogger.Println("Falied to write json data to file: ", err.Error())
		http.Error(resp, "Falied to write json data to file", http.StatusInternalServerError)
		return
	}

	// cmd1
	nameErr := fmt.Sprintf("scheme%d.err", cntFiles)
	outputErrPath := filepath.Join(dir, nameErr)

	errFile, err := os.Create(outputErrPath)
	if err != nil {
		config.RNLogger.Printf("Error while creating file for output of errors: %v\n", err)
	}
	defer errFile.Close()

	pyScriptPath := filepath.Join("./internal", "json2sv.py")
	cmd1 := exec.Command("python3", pyScriptPath, schemePath, inputsPath)

	cmd1.Stdout = errFile
	cmd1.Stderr = errFile

	if err := cmd1.Run(); err != nil {
		config.RNLogger.Printf("Command 1 failed: %v\n", err)
	}
	wd, _ := os.Getwd()
	config.RNLogger.Printf("Current working directory: %s", wd)

	// cmd2
	outputBinaryName := fmt.Sprintf("scheme%d.out", cntFiles)
	outputBinary := filepath.Join(dir, outputBinaryName)

	schemeSVName := fmt.Sprintf("scheme%d.sv", cntFiles)
	schemeSV := filepath.Join(dir, schemeSVName)
	inputsSVName := fmt.Sprintf("inputs%d.sv", cntFiles)
	inputsSV := filepath.Join(dir, inputsSVName)

	cmd2 := exec.Command("iverilog", "-g2012", "-o", outputBinary, schemeSV, inputsSV)

	cmd2.Stdout = errFile

	if err := cmd2.Run(); err != nil {
		config.RNLogger.Println("Command 2 failed: ", err)
	}

	// cmd3

	cmd3 := exec.Command("vvp", outputBinary)

	outputMsgName := fmt.Sprintf("scheme%d.msg", cntFiles)
	outputMsgPath := filepath.Join(dir, outputMsgName)
	msgFile, err := os.Create(outputMsgPath)
	if err != nil {
		config.RNLogger.Println("Error in creating .msg file")
	}
	defer msgFile.Close()

	cmd3.Stdout = msgFile
	if err := cmd3.Run(); err != nil {
		config.RNLogger.Println("Command 3 failed: %v", err)
	}

	// Writing response

	outputMsgFileName := fmt.Sprintf("scheme%d.msg", cntFiles)
	outputMsgFilePath := filepath.Join(dir, outputMsgFileName)
	data, err := os.ReadFile(outputMsgFilePath)
	if err != nil {
		config.RNLogger.Println("Error while reading .msg file")
	}
	config.RNLogger.Println("Содержимое файла:\n%s\n", string(data))

	str := string(data)
	re := regexp.MustCompile(`\[([^\]]+)\]`)
	matches := re.FindStringSubmatch(str)
	var value int
	if len(matches) > 1 {
		temp := strings.TrimSpace(matches[1])
		value, _ = strconv.Atoi(temp)
	} else {
		config.RNLogger.Println("No answer")
		resp.WriteHeader(http.StatusInternalServerError)
		return
	}
	var ans []int
	ans = append(ans, value)
	resp.Header().Set("Content-Type", "application/json")
	resp.WriteHeader(http.StatusOK)
	json.NewEncoder(resp).Encode(map[string][]int{
		"simulation_result": ans,
	})
}
