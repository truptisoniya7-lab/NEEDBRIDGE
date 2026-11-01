# NEEDBRIDGE — REST API Specification

> **Document Version:** 1.0.0  
> **Source Verification:** Extracted directly from Express route handlers in `server/src/routes/` and controllers in `server/src/controllers/`.

---

## Table of Contents
- [1. API Overview](#1-api-overview)
- [2. Base URL](#2-base-url)
- [3. Authentication Requirements](#3-authentication-requirements)
- [4. Request Headers](#4-request-headers)
- [5. Response Format](#5-response-format)
- [6. HTTP Status Codes](#6-http-status-codes)
- [7. Authentication Endpoints](#7-authentication-endpoints)
- [8. User Endpoints](#8-user-endpoints)
- [9. Request Management Endpoints](#9-request-management-endpoints)
- [10. Category Endpoints](#10-category-endpoints)
- [11. Response and Assistance Endpoints](#11-response-and-assistance-endpoints)
- [12. Dashboard Endpoints](#12-dashboard-endpoints)
- [13. Error Handling](#13-error-handling)
- [14. Validation Rules](#14-validation-rules)
- [15. API Usage Examples](#15-api-usage-examples)

---

## 1. API Overview
The NEEDBRIDGE REST API provides a stateless JSON interface for managing mutual aid workflows: user onboarding, authentication, request lifecycle management, volunteer assistance proposals, and community impact telemetry.

## 2. Base URL
- **Local Development:** `http://localhost:5000/api`
- **Frontend Client Proxy:** `/api` (proxied to `http://localhost:5000` via Vite)
- **Production (Render):** `https://needbridge-api.onrender.com/api`

## 3. Authentication Requirements
Protected routes require a valid JSON Web Token (JWT) transmitted via the standard HTTP `Authorization` header using the Bearer schema:
```http
Authorization: Bearer <your_jwt_token>
```

## 4. Request Headers
| Header | Value | Required On |
|---|---|---|
| `Content-Type` | `application/json` | All `POST`, `PUT`, `PATCH` requests |
| `Authorization` | `Bearer <token>` | Protected endpoints (profile, create request, offer help) |

## 5. Response Format
Standard JSON object or JSON array. Successful operations return relevant entity data or confirmation messages. Errors return a standardized `{ "error": "Descriptive message" }` payload.

## 6. HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or missing required fields.
- `401 Unauthorized`: Authentication token missing or invalid.
- `403 Forbidden`: Authenticated user lacks permission for action.
- `404 Not Found`: Target resource does not exist.
- `409 Conflict`: Unique constraint violation (e.g. duplicate email).
- `500 Internal Server Error`: Unhandled server exception.

---

## 7. Authentication Endpoints

### 7.1 Register Account
- **Endpoint:** `POST /api/auth/register`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword",
  "full_name": "Jane Doe",
  "role": "volunteer",
  "phone": "+1 (555) 019-2834",
  "location": "North Campus"
}
```
- **Response (201 Created):**
```json
{
  "message": "Account registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr-1700000000",
    "email": "jane@example.com",
    "full_name": "Jane Doe",
    "role": "volunteer",
    "location": "North Campus",
    "phone": "+1 (555) 019-2834",
    "created_at": "2026-11-01T23:30:00.000Z",
    "updated_at": "2026-11-01T23:30:00.000Z"
  }
}
```

### 7.2 Login
- **Endpoint:** `POST /api/auth/login`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```
- **Response (200 OK):**
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr-1700000000",
    "email": "jane@example.com",
    "full_name": "Jane Doe",
    "role": "volunteer"
  }
}
```

---

## 8. User Endpoints

### 8.1 Get Current User Profile
- **Endpoint:** `GET /api/auth/profile`
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):** Returns current user's profile object without password hash.

### 8.2 Update Profile
- **Endpoint:** `PUT /api/auth/profile`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
```json
{
  "full_name": "Jane Doe, M.Sc.",
  "bio": "Weekend volunteer driver and math tutor",
  "phone": "+1 (555) 999-8888",
  "location": "Downtown District",
  "avatar_url": "https://..."
}
```
- **Response (200 OK):** `{ "message": "Profile updated successfully", "user": { ... } }`

---

## 9. Request Management Endpoints

### 9.1 Browse / Search Requests
- **Endpoint:** `GET /api/requests`
- **Auth Required:** No
- **Query Parameters:**
  - `category` (string, optional): Category ID or slug
  - `urgency` (string, optional): `low` | `medium` | `high` | `critical`
  - `status` (string, optional): `open` | `in_progress` | `resolved`
  - `search` (string, optional): Search keyword
- **Response (200 OK):** Array of populated `AssistanceRequest` objects.

### 9.2 Get Single Request with Responses
- **Endpoint:** `GET /api/requests/:id`
- **Auth Required:** No
- **Response (200 OK):** Request object populated with `author`, `category`, and `responses` array.

### 9.3 Create Assistance Request
- **Endpoint:** `POST /api/requests`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
```json
{
  "title": "Need TI-84 Calculator for Finals",
  "description": "Looking to borrow a calculator for Calculus II final exam on Wednesday.",
  "category_id": "cat-1",
  "urgency": "high",
  "location": "Science Library Room 102",
  "contact_info": "discord: student#1234",
  "image_url": "https://..."
}
```
- **Response (201 Created):** `{ "message": "Assistance request posted successfully", "request": { ... } }`

### 9.4 Update Request Status
- **Endpoint:** `PATCH /api/requests/:id/status`
- **Auth Required:** Yes (Must be author or admin)
- **Request Body:** `{ "status": "resolved" }`
- **Response (200 OK):** `{ "message": "Request status updated to resolved", "request": { ... } }`

### 9.5 Delete Request
- **Endpoint:** `DELETE /api/requests/:id`
- **Auth Required:** Yes (Must be author or admin)
- **Response (200 OK):** `{ "message": "Request deleted successfully." }`

---

## 10. Category Endpoints

### 10.1 List Categories
- **Endpoint:** `GET /api/categories`
- **Auth Required:** No
- **Response (200 OK):** Array of Category objects with `request_count` counts.

---

## 11. Response and Assistance Endpoints

### 11.1 Submit Offer of Assistance
- **Endpoint:** `POST /api/responses/request/:requestId`
- **Auth Required:** Yes (Cannot offer on own request)
- **Request Body:**
```json
{
  "message": "I have an extra TI-84 calculator you can borrow through Thursday!",
  "contact_phone": "+1 (555) 234-5678"
}
```
- **Response (201 Created):** `{ "message": "Offer of assistance submitted successfully!", "response": { ... } }`

### 11.2 Update Assistance Offer Status
- **Endpoint:** `PATCH /api/responses/:id/status`
- **Auth Required:** Yes
- **Request Body:** `{ "status": "accepted" }`
- **Valid Status Values:** `pending`, `accepted`, `completed`, `declined`
- **Response (200 OK):** `{ "message": "Assistance offer status updated to accepted", "response": { ... } }`

---

## 12. Dashboard Endpoints

### 12.1 Get Global Community Impact Metrics
- **Endpoint:** `GET /api/dashboard/impact`
- **Auth Required:** No
- **Response (200 OK):**
```json
{
  "totalRequests": 4,
  "resolvedRequests": 1,
  "activeRequests": 3,
  "activeHelpers": 3,
  "totalCategories": 7,
  "resolutionRate": 25
}
```

### 12.2 Get User Personal Dashboard
- **Endpoint:** `GET /api/dashboard/user`
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):**
```json
{
  "myRequests": [ ... ],
  "myOffers": [ ... ],
  "stats": {
    "totalRequested": 1,
    "resolvedRequested": 0,
    "totalOffered": 2,
    "successfulHelps": 1
  }
}
```

---

## 13. Error Handling
All errors follow standard HTTP status conventions and return a JSON structure:
```json
{
  "error": "Error message describing the validation failure or missing resource"
}
```

## 14. Validation Rules
- `email`: Non-empty, valid format.
- `password`: Minimum 6 characters.
- `title`, `description`, `location`: Mandatory non-whitespace strings.
- `category_id`: Must correspond to an existing category.
- `urgency`: Must be one of `low`, `medium`, `high`, `critical`.

## 15. API Usage Examples
*(Tested and verified via `server/test_api.js` with 10 passing tests).*
```bash
# Health check
curl -X GET http://localhost:5000/api/health

# Browse open requests
curl -X GET "http://localhost:5000/api/requests?status=open"

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah.c@community.org","password":"password123"}'
```
