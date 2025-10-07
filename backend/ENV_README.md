# Environment Variables Information

This project uses a `.env` file for local development environment variables.

## Important Notes

1. The `.env` file contains sensitive information such as:
   - Database credentials
   - SMTP credentials
   - Secret keys

2. NEVER commit the `.env` file to Git:
   - It is already added to `.gitignore`
   - Contains sensitive information that should remain private

3. If you need to set up a new development environment:
   - Copy `example.env` to `.env`
   - Fill in your actual credentials in the new `.env` file

## Production Deployment

For Google Cloud App Engine deployment, set environment variables through the Google Cloud Console instead of committing them in `app.yaml`.