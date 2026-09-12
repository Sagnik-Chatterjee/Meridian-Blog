# Meridian Blog

Meridian Blog is a server-side rendered blogging application built using **Node.js, Express.js, MongoDB, and EJS**. It provides authentication, authorization, blog management, comments, reporting, and an admin dashboard.

## Live Demo

https://meridian-blog.onrender.com

## GitHub Repository

https://github.com/Sagnik-Chatterjee/Meridian-Blog

---

## Features

* User registration and login
* JWT-based authentication
* Role-based authorization for administrators
* Create, edit, and delete blogs
* View blogs by category
* Search blogs by title
* Comment on blogs
* Report inappropriate blogs
* Admin dashboard
* Admin can view users
* Admin can view reported blogs and reports
* Admin can delete blogs
* Cloudinary integration for blog cover images
* Server-side rendering using EJS
* HTTP-only authentication cookies
* Password hashing using SHA-256 and random salt

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* EJS
* Multer
* Cloudinary
* Cookie Parser
* dotenv

### Frontend

* EJS
* HTML
* CSS
* JavaScript

### Development

* Nodemon

---

## Application Architecture

The application follows a server-side rendering architecture.

```text
                Browser
                   |
                   v
              Express.js
                   |
        +----------+----------+
        |                     |
        v                     v
 Authentication          Authorization
 Middleware              Middleware
        |                     |
        +----------+----------+
                   |
                   v
                Routes
                   |
       +-----------+-----------+
       |           |           |
       v           v           v
     Models     Services    Cloudinary
       |
       v
    MongoDB
```

EJS templates are rendered on the server and sent to the browser as HTML.

---

## Project Structure

```text
Meridian-Blog/
|
|-- middlewares/
|   |-- authentication.js
|   |-- authorization.js
|   `-- cloudinary.js
|
|-- models/
|   |-- blog.js
|   |-- comment.js
|   |-- report.js
|   `-- user.js
|
|-- public/
|   |-- css/
|   |-- images/
|   `-- uploads/
|
|-- routes/
|   |-- admin.js
|   |-- blog.js
|   |-- report.js
|   `-- user.js
|
|-- services/
|   `-- authentication.js
|
|-- views/
|   |-- admin/
|   |-- partials/
|   |-- addBlog.ejs
|   |-- adminDashboard.ejs
|   |-- adminUsers.ejs
|   |-- blog.ejs
|   |-- editBlog.ejs
|   |-- editTitle.ejs
|   |-- error.ejs
|   |-- signin.ejs
|   |-- signup.ejs
|   `-- ...
|
|-- .gitignore
|-- index.js
|-- package.json
`-- package-lock.json
```

---

## 🗄️ Data Models

The application contains four main MongoDB models.

### User

Stores user account and authentication information.

Main fields:

* `fullName`
* `email`
* `password`
* `salt`
* `profileImageURL`
* `role`
* `createdAt`
* `updatedAt`

Roles:

* `USER`
* `ADMIN`

### Blog

Stores blog information.

Main fields:

* `title`
* `body`
* `category`
* `coverImageURL`
* `createdBy`
* `noOfReports`
* `createdAt`
* `updatedAt`

Available categories:

* Sports
* Food
* Education
* Gaming
* Travel
* Entertainment
* Technology

### Comment

Stores comments made on blogs.

Main fields:

* `content`
* `createdBy`
* `blogId`
* `createdAt`
* `updatedAt`

### Report

Stores reports submitted against blogs.

Main fields:

* `subject`
* `blogId`
* `reportedBy`
* `createdAt`
* `updatedAt`

---

## Authentication & Authorization

The application uses **JWT-based authentication**.

When a user successfully signs in:

1. The server verifies the email and password.
2. A JWT is generated.
3. The JWT is stored in an HTTP-only cookie.
4. The authentication middleware verifies the token on subsequent requests.
5. The authenticated user's information is stored in `req.user`.

Authentication status used throughout the routing documentation:

* 🔓 **No Authentication** - Route can be accessed without logging in.
* 🔒 **Authenticated** - User must be logged in.
* 🛡️ **Admin Only** - User must be logged in and have the `ADMIN` role.

---

## Middleware

The application uses three main middlewares.

### 1. Authentication Middleware

`middlewares/authentication.js`

Responsible for:

* Reading the JWT from the cookie
* Verifying the JWT
* Setting `req.user`
* Allowing unauthenticated requests to continue when no valid token exists

### 2. Authorization Middleware

`middlewares/authorization.js`

Responsible for:

* Checking whether the authenticated user has the `ADMIN` role
* Restricting admin routes to administrators

### 3. Cloudinary Middleware

`middlewares/cloudinary.js`

Responsible for:

* Configuring Cloudinary
* Uploading files to Cloudinary
* Removing temporary local files after upload
* Deleting uploaded Cloudinary resources when required

---

## Routing

There are four route files inside the `routes` folder.

```text
routes/
|
|-- admin.js   -> /admin
|-- blog.js    -> /blog
|-- user.js    -> /user
`-- report.js  -> /report
```

### Route Files

| Router File | Base Path | Purpose                                      |
| ----------- | --------- | -------------------------------------------- |
| `user.js`   | `/user`   | User registration, login and logout          |
| `blog.js`   | `/blog`   | Blog creation, editing, viewing and deletion |
| `report.js` | `/report` | Blog reporting                               |
| `admin.js`  | `/admin`  | Administrator functionality                  |

---

## Routing Table

### User Routes

| Method | Route          | Authentication       | Description                      |
| ------ | -------------- | -------------------- | -------------------------------- |
| GET    | `/user/signup` | 🔓 No Authentication | Display signup page              |
| POST   | `/user/signup` | 🔓 No Authentication | Register a new user              |
| GET    | `/user/signin` | 🔓 No Authentication | Display signin page              |
| POST   | `/user/signin` | 🔓 No Authentication | Authenticate user and create JWT |
| GET    | `/user/logout` | 🔒 Authenticated     | Logout the user                  |

### Blog Routes

| Method | Route                    | Authentication       | Description                  |
| ------ | ------------------------ | -------------------- | ---------------------------- |
| GET    | `/blog/add-new`          | 🔒 Authenticated     | Display create blog page     |
| POST   | `/blog/`                 | 🔒 Authenticated     | Create a new blog            |
| GET    | `/blog/:id`              | 🔓 No Authentication | View a blog                  |
| POST   | `/blog/comment/:blogId`  | 🔒 Authenticated     | Add a comment                |
| GET    | `/blog/user/myblogs/:id` | 🔒 Authenticated     | View blogs created by a user |
| GET    | `/blog/editTitle/:id`    | 🔒 Authenticated     | Display title editing page   |
| POST   | `/blog/editTitle/:id`    | 🔒 Authenticated     | Update blog title            |
| GET    | `/blog/edit/:id`         | 🔒 Authenticated     | Display blog editing page    |
| POST   | `/blog/editBlog/:id`     | 🔒 Authenticated     | Update blog content          |
| DELETE | `/blog/delete/:id`       | 🔒 Authenticated     | Delete a blog                |

### Report Routes

| Method | Route         | Authentication   | Description                |
| ------ | ------------- | ---------------- | -------------------------- |
| POST   | `/report/:id` | 🔒 Authenticated | Submit a report for a blog |
| DELETE | `/report/:id` | 🔒 Authenticated | Delete/remove a report     |

### Admin Routes

| Method | Route                   | Authentication | Description                          |
| ------ | ----------------------- | -------------- | ------------------------------------ |
| GET    | `/admin/`               | 🛡️ Admin Only | Display admin dashboard              |
| GET    | `/admin/users`          | 🛡️ Admin Only | View registered users                |
| GET    | `/admin/reported-blogs` | 🛡️ Admin Only | View blogs that have been reported   |
| GET    | `/admin/blog/:id`       | 🛡️ Admin Only | View a reported blog and its reports |

---

## Blog Management

Authenticated users can:

* Create new blogs
* Add a title, body, category, and cover image
* Edit their blog title
* Edit their blog content
* Delete their blogs
* View their own blogs

Blog cover images are uploaded to Cloudinary.

Users can only edit their own blogs.

---

## Comment System

Authenticated users can comment on blogs.

Each comment stores:

* Comment content
* User who created the comment
* Blog associated with the comment
* Creation and update timestamps

Comments are populated with the user information when displaying a blog.

---

## Reporting System

Authenticated users can report blogs.

Each report contains:

* Report subject
* Blog being reported
* User who submitted the report
* Creation and update timestamps

The blog's `noOfReports` value is incremented whenever a report is created.

When a report is deleted, the blog's report count is decremented.

---

## Admin Dashboard

Administrators have access to a separate admin section.

The admin dashboard provides:

* Total number of users
* Total number of blogs
* List of users
* List of reported blogs
* Details of reported blogs
* Report information

Administrators can also delete blogs.

All routes under `/admin` are protected by the authorization middleware.

---

## Search & Categories

The home page supports:

### Search

Users can search blogs by title.

The search uses a case-insensitive regular expression.

Example:

```text
/?search=technology
```

### Categories

Blogs can be filtered by category.

Supported categories:

```text
Sports
Food
Education
Gaming
Travel
Entertainment
Technology
```

Example:

```text
/?category=Technology
```

---

## Server-Side Rendering

The application uses **EJS (Embedded JavaScript Templates)** for server-side rendering.

Express is configured to use EJS as the view engine.

```javascript
app.set("view engine", "ejs");
```

The server renders EJS templates and sends the generated HTML to the client.

This approach is used for:

* Blog pages
* Authentication pages
* Admin pages
* Blog creation/editing pages
* Error pages
* Other application views

---

## JWT Authentication

JSON Web Tokens are used for authentication.

The JWT contains information such as:

* User ID
* Full name
* Email
* Profile image
* Role

The token is stored inside an HTTP-only cookie.

This allows the authentication middleware to identify the currently logged-in user.

---

## Cloudinary Integration

Cloudinary is used to store blog cover images.

The upload process is:

```text
User selects image
       |
       v
     Multer
       |
       v
Temporary local file
       |
       v
   Cloudinary
       |
       v
Cloudinary URL stored in MongoDB
       |
       v
Temporary local file deleted
```

When a blog is deleted, its associated Cloudinary image can also be removed.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Sagnik-Chatterjee/Meridian-Blog.git
```

### 2. Navigate to the project

```bash
cd Meridian-Blog
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

```env
PORT=8000

MONGO_URL=your_mongodb_connection_string

SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 5. Run the application in development mode

```bash
npm run dev
```

### 6. Run the application in production mode

```bash
npm start
```

The application will run on:

```text
http://localhost:8000
```

---

## Key Concepts Demonstrated

* Server-Side Rendering
* MVC-style project organization
* RESTful routing
* JWT authentication
* Role-based authorization
* HTTP-only cookies
* Password hashing
* MongoDB and Mongoose
* Mongoose population
* Middleware
* File uploads with Multer
* Cloudinary file storage
* CRUD operations
* Search and filtering
* User-generated content
* Blog commenting
* Blog reporting
* Admin functionality
* Error handling

---

## Learning Outcomes

This project provided practical experience with:

* Building a complete Express.js web application
* Designing MongoDB schemas using Mongoose
* Implementing JWT authentication
* Implementing role-based authorization
* Working with server-side rendered EJS pages
* Handling file uploads
* Integrating Cloudinary
* Designing and organizing Express routes
* Building CRUD functionality
* Managing relationships between MongoDB models
* Implementing search and category filtering
* Creating an administrative dashboard

---

## Links

Live Application:

https://meridian-blog.onrender.com

GitHub Repository:

https://github.com/Sagnik-Chatterjee/Meridian-Blog

---

## Author

**Sagnik Chatterjee**

GitHub:
https://github.com/Sagnik-Chatterjee
