# Deployment Instructions for Feedback App Backend

This guide explains how to deploy the Feedback App backend to Google App Engine.

## Prerequisites

1. Google Cloud SDK installed and configured
2. Access to the Google Cloud project
3. `.env` file with correct configuration values

## Deployment Files

- `app.yaml`: Contains the actual deployment configuration, including environment variables
- `app.yaml.example`: A template version without sensitive data (can be committed to Git)

## Deployment Process

### 1. Prepare the app.yaml file

The `app.yaml` file contains all environment variables needed for the application. There are two approaches:

**Option 1 (Current setup):** Hard-code values in app.yaml
- Values from your `.env` file have been copied to `app.yaml`
- This file is in `.gitignore` to prevent accidentally committing credentials
- Simple deployment but less secure for production environments

**Option 2 (More secure):** Use Google Cloud Secret Manager
- Remove sensitive values from `app.yaml`
- Store them in Google Cloud Secret Manager
- Reference them in `app.yaml` using `${VARIABLE_NAME}` syntax

### 2. Deploy the application

Run the deployment script:

```bash
./bin/deploy-backend.sh
```

This will deploy the application to Google App Engine using your `app.yaml` configuration.

### 3. Verify the deployment

After deployment, check the application logs in the Google Cloud Console to verify everything is working correctly.

## Security Notes

- The current `app.yaml` contains actual credentials - do not commit it to Git
- For production environments, consider using Google Cloud Secret Manager
- The `.gitignore` file is configured to ignore `app.yaml` to prevent accidental commits