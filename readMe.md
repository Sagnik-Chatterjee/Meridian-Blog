Meridian Blog

A full-stack blog application built with Node.js, Express.js, MongoDB, Mongoose, and EJS. The application uses Server-Side Rendering (SSR) for the frontend and JWT-based authentication for secure user authentication.

Users can create and manage their own blogs, comment on other blogs, and report inappropriate content. Administrators have access to a dedicated dashboard where they can review reported blogs and delete blogs when necessary.

 Live Demo

Live Application:
https://meridian-blog.onrender.com

GitHub Repository:
https://github.com/Sagnik-Chatterjee/Meridian-Blog

 Features
User Features
User registration and login
JWT-based authentication
Authentication using HTTP-only cookies
Create blogs
Upload blog cover images
Edit own blogs
Delete own blogs
Search blogs by title
Filter blogs by category
Comment on blogs
Report blogs
View personal blogs
Logout
Admin Features
Role-based authorization
Dedicated admin dashboard
View registered users
View blogs
View reported blogs
View reports associated with a blog
Delete blogs
Manage reported content
 Tech Stack
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
Frontend
EJS
HTML
CSS
JavaScript
Server-Side Rendering (SSR)
Other Technologies
Cloudinary — image storage
Multer — file upload handling
Cookie Parser — cookie handling
dotenv — environment variable management
 Application Architecture

The application follows a server-side rendered architecture where Express handles the application logic and EJS templates generate the HTML that is sent to the browser.

                        Browser
                           │
                           ▼
                     Express Server
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   Authentication   Authorization        Routes
      Middleware       Middleware           │
                                            │
              ┌─────────────┬───────────────┼─────────────┐
              │             │               │             │
              ▼             ▼               ▼             ▼
            /user         /blog           /report       /admin
              │             │               │             │
              └─────────────┴───────────────┴─────────────┘
                                            │
                                            ▼
                                         Mongoose
                                            │
                                            ▼
                                         MongoDB

                        Blog Images
                             │
                             ▼
                         Cloudinary
 Project Structure
Meridian-Blog/
│
├── middlewares/
│   ├── authentication.js
│   ├── authorization.js
│   └── cloudinary.js
│
├── models/
│   ├── blog.js
│   ├── comment.js
│   ├── report.js
│   └── user.js
│
├── public/
│   └── ...
│
├── routes/
│   ├── admin.js
│   ├── blog.js
│   ├── report.js
│   └── user.js
│
├── services/
│   └── authentication.js
│
├── views/
│   └── ...
│
├── .gitignore
├── index.js
├── package.json
└── package-lock.json
🗄️ Data Models

The application contains four main MongoDB/Mongoose models.

User

Stores user account information and role information.

User
├── fullName
├── email
├── password
├── salt
├── profileImageURL
└── role

Users can have different roles, including regular users and administrators.

Blog

Stores the content and metadata of each blog.

Blog
├── title
├── category
├── body
├── coverImageURL
├── createdBy
├── noOfReports
├── createdAt
└── updatedAt

Each blog is associated with the user who created it.

Comment

Stores comments made by users on blogs.

Comment
├── content
├── createdBy
├── blogId
├── createdAt
└── updatedAt

A comment references both the user who created it and the blog it belongs to.

Report

Stores reports submitted against blogs.

Report
├── subject
├── blogId
├── reportedBy
├── createdAt
└── updatedAt

Reports are associated with both the reported blog and the user who submitted the report.

 Authentication & Authorization

The application uses JWT (JSON Web Token) for authentication.

Authentication Flow
User Login
    │
    ▼
Verify Credentials
    │
    ▼
Generate JWT
    │
    ▼
Store JWT in HTTP-only Cookie
    │
    ▼
Authenticated Requests
    │
    ▼
Authentication Middleware
    │
    ▼
req.user

The authentication middleware verifies the JWT from the cookie and attaches the authenticated user's information to req.user.

Authorization

A separate authorization middleware is used to restrict admin functionality.

Request
   │
   ▼
Authentication
   │
   ▼
Authorization
   │
   ├── USER  ──► Normal User Routes
   │
   └── ADMIN ──► Admin Routes

The /admin route group is protected so that only authorized administrators can access it.

 Middleware

The application uses three main middleware modules.

Authentication Middleware

Responsible for:

Reading the JWT from cookies
Verifying the token
Identifying the logged-in user
Attaching user information to req.user
Authorization Middleware

Responsible for:

Checking the user's role
Restricting admin-only functionality
Protecting /admin routes
Cloudinary Middleware

Responsible for handling blog cover image uploads.

The image upload flow is:

Image Selected
      │
      ▼
    Multer
      │
      ▼
Temporary File
      │
      ▼
  Cloudinary
      │
      ▼
Cloudinary URL
      │
      ▼
 Blog Document
      │
      ▼
   MongoDB
 Routing

The application has four route files:

routes/
├── admin.js
├── blog.js
├── report.js
└── user.js

They are mounted in the main application as:

Router	Base Path	Purpose
admin.js	/admin	Admin dashboard and administration
blog.js	/blog	Blog and comment functionality
user.js	/user	Authentication and user functionality
report.js	/report	Blog reporting functionality
 Routing Table
User Routes
Method	Route	Authentication	Description
GET	/user/signup	❌	Display signup page
POST	/user/signup	❌	Register a new user
GET	/user/signin	❌	Display signin page
POST	/user/signin	❌	Authenticate user and create JWT
GET	/user/logout	✅	Logout the current user
Blog Routes
Method	Route	Authentication	Description
GET	/blog/add-new	✅	Display create-blog page
POST	/blog/	✅	Create a new blog
GET	/blog/:id	❌	View a specific blog
POST	/blog/comment/:blogId	✅	Add a comment to a blog
GET	/blog/user/myblogs/:id	✅	View blogs created by a user
GET	/blog/editTitle/:id	✅	Display title editing page
POST	/blog/editTitle/:id	✅	Update blog title
GET	/blog/edit/:id	✅	Display blog editing page
POST	/blog/editBlog/:id	✅	Update blog content
DELETE	/blog/delete/:id	✅	Delete a blog
Report Routes
Method	Route	Authentication	Description
POST	/report/:id	✅	Submit a report for a blog
DELETE	/report/:id	✅	Delete/remove a report

When a report is created, the corresponding blog's report count is increased.

Admin Routes
Method	Route	Authorization	Description
GET	/admin/	🔐 Admin	Display admin dashboard
GET	/admin/users	🔐 Admin	View registered users
GET	/admin/reported-blogs	🔐 Admin	View reported blogs
GET	/admin/blog/:id	🔐 Admin	View a reported blog and its reports
Route Protection
/admin/*
    │
    ▼
Authentication
    │
    ▼
Authorization
    │
    ├── Admin ──► Continue
    │
    └── User ──► Access Denied
 Blog Management

Users can perform CRUD operations on their own blogs.

Create

Users provide:

Title
Category
Blog content
Cover image

The cover image is uploaded to Cloudinary and the resulting URL is stored with the blog.

Edit

Users can edit their own:

Blog title
Blog content
Delete

Users can delete their own blogs.

When a blog is deleted, its related comments and reports are also removed, and the associated Cloudinary image is deleted.

 Comment System

Authenticated users can comment on blogs.

User
 │
 ▼
Blog
 │
 ▼
Add Comment
 │
 ▼
Comment Collection
 │
 ├── User Reference
 └── Blog Reference

Comments maintain references to both the user and the blog.

 Reporting System

Users can report blogs that they consider inappropriate.

User
 │
 ▼
Report Blog
 │
 ▼
Create Report
 │
 ├── User
 ├── Blog
 └── Subject
 │
 ▼
Increment Report Count
 │
 ▼
Admin Dashboard

Administrators can review reported blogs and inspect the reports associated with them.

 Admin Dashboard

The admin dashboard provides functionality for managing the application.

Administrators can:

View application statistics
View registered users
View reported blogs
View individual reports
Review reported content
Delete blogs when necessary
 Search & Categories

The application provides blog discovery functionality through:

Blog title search
Category filtering

This allows users to find blogs based on their interests and search terms.

 Server-Side Rendering

The frontend is rendered using EJS rather than a separate frontend framework.

The request flow is:

Browser
   │
   ▼
Express Route
   │
   ▼
Database Query
   │
   ▼
Mongoose
   │
   ▼
Data
   │
   ▼
EJS Template
   │
   ▼
Rendered HTML
   │
   ▼
Browser

This approach keeps the frontend and backend within the same Express application.

 Cloudinary Integration

Cloudinary is used to store blog cover images.

Instead of storing image files directly in MongoDB, the application stores the Cloudinary URL in the blog document.

User Upload
     │
     ▼
   Multer
     │
     ▼
 Cloudinary
     │
     ▼
 Image URL
     │
     ▼
 MongoDB

This keeps the database lightweight while allowing images to be managed through Cloudinary.

 Installation
1. Clone the repository
git clone https://github.com/Sagnik-Chatterjee/Meridian-Blog.git
cd Meridian-Blog
2. Install dependencies
npm install
3. Create .env

Create a .env file in the root directory and configure the required environment variables.

PORT=8000

MONGO_URL=your_mongodb_connection_string

SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Never commit your .env file or expose your database, JWT, or Cloudinary credentials.

4. Run the application
Development
npm run dev
Production
npm start

The application will be available at:

http://localhost:8000
 Key Concepts Demonstrated

This project demonstrates practical experience with:

Node.js
Express.js
MongoDB
Mongoose
EJS
Server-Side Rendering
JWT Authentication
HTTP-only Cookies
Role-Based Authorization
Express Middleware
CRUD Operations
MongoDB References
Multer
Cloudinary
Password Hashing
Search and Filtering
Comments
Content Reporting
Admin Dashboard
Error Handling
 Learning Outcomes

Through this project, I gained practical experience in building a complete web application with:

Authentication and authorization
Server-side rendering
REST-style routing
Database design using MongoDB and Mongoose
File upload and cloud storage
Middleware-based request processing
Role-based access control
User-generated content
Admin moderation
Relational references between MongoDB collections
 Links

Live Demo:
https://meridian-blog.onrender.com

GitHub Repository:
https://github.com/Sagnik-Chatterjee/Meridian-Blog

 Author

Sagnik Chatterjee

GitHub:
https://github.com/Sagnik-Chatterjee