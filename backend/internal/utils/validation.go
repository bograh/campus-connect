package utils

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

func ValidateStruct(s interface{}) error {
	return validate.Struct(s)
}

func DecodeAndValidate(r *http.Request, v interface{}) error {
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		return fmt.Errorf("invalid JSON: %w", err)
	}

	if err := ValidateStruct(v); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	return nil
}

func FormatValidationError(err error) string {
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, fieldErr := range validationErrors {
			switch fieldErr.Tag() {
			case "required":
				return fmt.Sprintf("%s is required", fieldErr.Field())
			case "email":
				return fmt.Sprintf("%s must be a valid email", fieldErr.Field())
			case "min":
				return fmt.Sprintf("%s must be at least %s characters", fieldErr.Field(), fieldErr.Param())
			case "gt":
				return fmt.Sprintf("%s must be greater than %s", fieldErr.Field(), fieldErr.Param())
			default:
				return fmt.Sprintf("%s failed validation (%s)", fieldErr.Field(), fieldErr.Tag())
			}
		}
	}
	return err.Error()
}
