# SkillSwapBackend
Backend for the oddo project

```
#File Structure
Odoo_backend/
├── config/
│   └── db.js                     # MongoDB connection
├── controllers/
│   ├── auth.controller.js       # Login, Register
│   ├── user.controller.js       # Profile CRUD
│   ├── swap.controller.js       # Swap request logic
│   └── upload.controller.js     # Image upload logic
├── middleware/
│   ├── auth.middleware.js       # JWT verification
│   └── errorHandler.js          # Error handling
├── models/
│   ├── User.js                  # User schema
│   ├── Swap.js                  # Swap schema
│   └── Feedback.js              # Feedback schema (optional)
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── swap.routes.js
│   └── upload.routes.js
├── utils/
│   └── cloudinary.js            # Cloudinary image config
├── .env                         # Environment variables
├── server.js                    # App entry point
├── package.json
└── README.md

```

# Skill Swap Platform

A backend for a skill swap platform built for the Odoo Hackathon. Users can list skills, request swaps, provide feedback, and admins can manage content.

## Features
- User authentication (signup, login)
- Profile management (name, location, profile photo, skills, availability, public/private)
- Skill search and browsing
- Swap request creation, acceptance, rejection, and cancellation
- Post-swap feedback with ratings
- Admin functionalities: reject skills, ban users, monitor swaps, send messages, generate reports

## Tech Stack
- Node.js, Express
- MongoDB, Mongoose
- Cloudinary for image uploads
- JWT for authentication

## Setup
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd Odoo_backend
