package utils

import (
	"encoding/json"
	"net/http"
)

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
}

type SuccessResponse struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func WriteJSONResponse(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}

func WriteErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	response := ErrorResponse{
		Error:   http.StatusText(statusCode),
		Message: message,
	}
	WriteJSONResponse(w, statusCode, response)
}

func WriteSuccessResponse(w http.ResponseWriter, message string, data interface{}) {
	response := SuccessResponse{
		Message: message,
		Data:    data,
	}
	WriteJSONResponse(w, http.StatusOK, response)
}

func WriteCreatedResponse(w http.ResponseWriter, message string, data interface{}) {
	response := SuccessResponse{
		Message: message,
		Data:    data,
	}
	WriteJSONResponse(w, http.StatusCreated, response)
}
