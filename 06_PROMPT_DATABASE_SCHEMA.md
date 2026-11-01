# Task 06: Create `DATABASE_SCHEMA.md`

> Prerequisite: follow everything in `00_MASTER_CONTEXT.md` (inspect the repo first, obey all constraints).

**Output file:** `DATABASE_SCHEMA.md` (repository root)
**Purpose:** Database design and relationships

## Required sections (in this order)
1. Database Overview
2. Database Technology
3. Entity Relationship Diagram
4. Users Table
5. Requests Table
6. Categories Table
7. Responses Table
8. Notifications Table if implemented
9. Table Relationships
10. Primary and Foreign Keys
11. Indexes and Constraints
12. Data Validation
13. Database Security
14. Example SQL Queries

## Requirements
- Start with a title and a Table of Contents.
- Base every statement on verified repository content; use `TODO:` where it cannot be verified.
- Label items as **Implemented** or **Planned** where relevant.
- Add Mermaid diagrams, tables and code snippets wherever they help.
- No secrets or real credentials.

## File-specific note
Extract the schema from migrations / models / SQL files. Only document tables that really exist; the Notifications section must say 'Not implemented' if absent. Use a Mermaid erDiagram.

## Done when
The file exists in the repository root, renders correctly as GitHub Flavored Markdown, and matches the actual source code.
