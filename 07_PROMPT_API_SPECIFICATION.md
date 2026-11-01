# Task 07: Create `API_SPECIFICATION.md`

> Prerequisite: follow everything in `00_MASTER_CONTEXT.md` (inspect the repo first, obey all constraints).

**Output file:** `API_SPECIFICATION.md` (repository root)
**Purpose:** Backend API documentation

## Required sections (in this order)
1. API Overview
2. Base URL
3. Authentication Requirements
4. Request Headers
5. Response Format
6. HTTP Status Codes
7. Authentication Endpoints
8. User Endpoints
9. Request Management Endpoints
10. Category Endpoints
11. Response and Assistance Endpoints
12. Dashboard Endpoints
13. Error Handling
14. Validation Rules
15. API Usage Examples

## Requirements
- Start with a title and a Table of Contents.
- Base every statement on verified repository content; use `TODO:` where it cannot be verified.
- Label items as **Implemented** or **Planned** where relevant.
- Add Mermaid diagrams, tables and code snippets wherever they help.
- No secrets or real credentials.

## File-specific note
Document only endpoints found in routes/controllers (method, path, auth, body, response). Mark missing groups as 'Not implemented'.

## Done when
The file exists in the repository root, renders correctly as GitHub Flavored Markdown, and matches the actual source code.
