package services

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryConfig struct {
	CloudName string
	APIKey    string
	APISecret string
}

type CloudinaryService struct {
	client *cloudinary.Cloudinary
}

func NewCloudinaryService(config CloudinaryConfig) (*CloudinaryService, error) {
	cld, err := cloudinary.NewFromParams(config.CloudName, config.APIKey, config.APISecret)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}

	return &CloudinaryService{
		client: cld,
	}, nil
}

func (c *CloudinaryService) UploadProfileImage(file io.Reader, fileName string, userID string) (string, error) {
	ctx := context.Background()

	uploadParams := uploader.UploadParams{
		PublicID:       fmt.Sprintf("profile_images/%s", userID),
		Folder:         "campus-connect/profiles",
		ResourceType:   "image",
		Overwrite:      api.Bool(true),
		Format:         "jpg",
		Transformation: "c_fill,w_300,h_300,q_auto:good",
	}

	result, err := c.client.Upload.Upload(ctx, file, uploadParams)
	if err != nil {
		return "", fmt.Errorf("failed to upload image to Cloudinary: %w", err)
	}

	return result.SecureURL, nil
}

func (c *CloudinaryService) DeleteProfileImage(publicID string) error {
	ctx := context.Background()

	_, err := c.client.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID:     publicID,
		ResourceType: "image",
	})

	if err != nil {
		return fmt.Errorf("failed to delete image from Cloudinary: %w", err)
	}

	return nil
}

func (c *CloudinaryService) UploadFromMultipartFile(fileHeader *multipart.FileHeader, userID string) (string, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer file.Close()

	return c.UploadProfileImage(file, fileHeader.Filename, userID)
}
