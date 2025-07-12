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

Skill Swap Platform
A backend for a skill swap platform built for the Odoo Hackathon. Users can list skills, request swaps, provide feedback, and admins can manage content.
Features

User authentication (signup, login, forgot password with OTP)
Profile management (name, location, profile photo, skills, availability, public/private)
Skill search and browsing
Swap request creation, acceptance, rejection, and cancellation
Post-swap feedback with ratings
Admin functionalities: reject skills, ban users, monitor swaps, send messages, generate reports

Tech Stack

Node.js, Express
MongoDB, Mongoose
Cloudinary for image uploads
JWT for authentication
Nodemailer for email-based OTP password reset

Setup

Clone the repository:
git clone <repo-url>
cd Odoo_backend


Install dependencies:
npm install


Create a .env file with:
MONGO_URI=your_mongodb_url_here
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GMAIL_USER=your_gmail_email
GMAIL_PASS=your_gmail_app_password
PORT=5000


Start the server:
npm start


For development with auto-restart:
npm run dev



API Endpoints

Auth:
POST /api/auth/signup - Register a user
POST /api/auth/login - Login a user
POST /api/auth/forgot-password - Send OTP to email for password reset
POST /api/auth/verify-otp - Verify OTP
POST /api/auth/reset-password - Reset password using reset token


User:
PUT /api/users/profile - Update user profile (requires auth, supports photo upload)
GET /api/users/search?skill=<skill> - Search users by skill
GET /api/users/profile - Get current user profile (requires auth)


Swap:
POST /api/swaps/request - Create a swap request (requires auth)
PUT /api/swaps/accept/:swapId - Accept a swap (requires auth)
PUT /api/swaps/reject/:swapId - Reject a swap (requires auth)
DELETE /api/swaps/delete/:swapId - Delete a pending swap (requires auth)
GET /api/swaps - Get user’s swaps (requires auth)
POST /api/swaps/feedback - Submit feedback for a swap (requires auth)


Upload:
POST /api/upload/profile-photo - Upload profile photo (requires auth)


Admin:
POST /api/admin/reject-skill - Reject inappropriate skill (requires admin auth)
PUT /api/admin/ban/:userId - Ban a user (requires admin auth)
GET /api/admin/swap-stats - Get swap statistics (requires admin auth)
POST /api/admin/message - Send platform-wide message (requires admin auth)
GET /api/admin/reports - Download user activity reports (requires admin auth)



