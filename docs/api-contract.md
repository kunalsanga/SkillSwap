# API Contract

This document outlines the standard API response structure and endpoint conventions for the Skill Swap Platform.

## Base URL
All API requests should be prefixed with `/api`. For example, `/api/auth/login`.

## Standard Response Format
Every API response will return a standard JSON object containing a `success` boolean, `message`, and `data`.

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "key": "value"
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "message": "Error description here",
  "stack": "..." // Only present in development environment
}
```

## Authentication
Protected routes require a JWT token in the `Authorization` header.
Format: `Bearer <token>`

## Initial Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive a token
