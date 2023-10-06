# User and Post Management API

**Table of Contents:**

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Database Setup](#database-setup)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Project Details](#project-details)

## Overview

The User and Post Management API is a robust solution for managing user registrations and posts. It allows users to sign up using their name and email, create posts with content and user field, delete posts by providing a postID, and fetch all posts made by a specific user. This API is built using modern web technologies to provide a scalable and efficient solution for user and post management.

## Technologies Used

- **Node.js**: A server-side runtime environment for building scalable web applications.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **MySQL**: A popular relational database management system for storing and retrieving data.

## Database Setup

Before you can use the API, you must set up a MySQL database. Follow these steps:

1. **Create the Database**:

   ```sql
   CREATE DATABASE user_post;
2. **Use Database**:  
  
   ```sql
   USE user_post;
   
 3. **Create the User Table**:
 
    ```sql
    CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL UNIQUE);
4. **Create the Post Tablee**:
 
    ```sql
    CREATE TABLE posts (id INT AUTO_INCREMENT PRIMARY KEY,userId INT,
    content TEXT NOT NULL,FOREIGN KEY (userId) REFERENCES users(id));

## Getting Started

To start using the API, follow these steps:

1. **Install project dependencies by running**:
    ```bash
    npm install

2. **Start the server in development mode**:
    ```bash
    npm run dev

### API Endpoints
The API provides the following endpoints:

1.**User Sign-Up API**:
- Endpoint: POST /api/signup:
- Request Body:
   name (string): The user's name.
   email (string): The user's email address.
- Response: 200 OK for successful user sign-up.

2.**Create Post API**:
- Endpoint: POST /api/posts:
- Request Body:
   userId (string): The ID of the user creating the post
   content (string): The content of the post.
- Response: 200 OK for successful post creation.

3.**Delete Post API**:
- Endpoint: DELETE /api/deletepost/:postId:
- Request Params:  postId (string): The ID of the post to be deleted.
- Response: 200 OK for successful post deletion

4.**Fetch User's Posts API**:
- Endpoint: GET /api/posts/:userId:
- Request Params:  userId (string): The ID of the user whose posts are to be fetched.
- Response: 200 OK with all posts from the user.


### Project Details

This project is a well-structured API for user and post management. It employs Node.js, Express.js, and MySQL to offer essential functionalities for user registration, post creation, post deletion, and post retrieval. The API can serve as a foundation for building more complex web applications or services.



