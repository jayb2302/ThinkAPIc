# 📌 ThinkAPIc

### 🚀 REST API for Web Development Students' Exam Preparation

This API helps web development students prepare for exams by providing structured **course topics, quizzes, coding challenges, debugging exercises, and study progress tracking**. Initially built for the **API Course**, it is designed to be **scalable** for additional courses such as **Frontend, Fullstack, Development Environments, and Web Technologies**.

---

## **📌 Features**

### **1️⃣ Course & Topic Management**
✅ CRUD (Create, Read, Update, Delete) operations for **topics**.  
✅ Topics are **linked to a specific course**.  
✅ Includes **key points & study resources**.  

### **2️⃣ User Authentication**
✅ **User Registration & Login** (JWT-based authentication).  
✅ **Protected Routes** (Only logged-in users can add/edit content).  

### **3️⃣ Quizzes & Coding Challenges**
✅ Auto-generated **multiple-choice quizzes** based on topics.  
✅ Hands-on **coding exercises & debugging tasks** for API concepts.  

### **4️⃣ Study Progress Tracking**
✅ Tracks **completed topics** for students.  
✅ Identifies **weak areas** for improvement.  

### **5️⃣ Security & Documentation**
✅ **JWT Authentication** for protected routes.  
✅ **CORS & Helmet** for security.  
✅ **Swagger API Documentation**.  

---

## **📌 Tech Stack**

| **Technology**  | **Usage**  |
|---------------|------------|
| **Node.js**  | Backend runtime environment  |
| **Express.js**  | REST API framework  |
| **TypeScript**  | Type safety & maintainability  |
| **MongoDB + Mongoose**  | NoSQL Database & ORM  |
| **JWT + bcrypt.js**  | Authentication & password hashing  |
| **Joi**  | Request validation  |
| **Helmet + CORS**  | Security enhancements  |
| **Swagger**  | API Documentation  |
| **Jest/Postman**  | API Testing  |

---

## **📌 Installation & Setup**

### **1️⃣ Clone Repository & Install Dependencies**
```sh
git clone https://github.com/YOUR_USERNAME/ThinkAPIc.git
cd ThinkAPIc
npm install
```

### **2️⃣ Configure Environment Variables**
Create a `.env` file in the root and add:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=4000
```

### **3️⃣ Start the Server**
```sh
npm run start-dev  # Development mode with nodemon
```

### **4️⃣ Run Tests**
```sh
npm test
```

---

## **📌 API Endpoints**

### **📝 Topics**
📌 **Get all topics:**  
```http
GET /api/topics
```
📌 **Add a new topic (Auth Required):**  
This endpoint allows you to add a new topic to the database. You must include a valid JWT token in the Authorization header.

### HTTP Request
```http
POST /api/topics
Authorization: Bearer <JWT_TOKEN>
```
#### Request Body
```json
{
  "course_id": "65fe12345abc6789def01234",
  "title": "Understanding HTTP Methods",
  "week": 2,
  "summary": "Explains GET, POST, PUT, DELETE in REST APIs.",
  "keyPoints": [
    "GET retrieves data",
    "POST creates new resources",
    "PUT updates existing resources",
    "DELETE removes resources"
  ],
  "resources": [
    { "title": "MDN HTTP Methods", "link": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" }
  ]
}
```
#### Sample Response
```json
{
  "_id": "679a893cad0abb4004983c72",
  "title": "Understanding HTTP Methods",
  "week": 2,
  "summary": "Explains GET, POST, PUT, DELETE in REST APIs.",
  "keyPoints": [
    "GET retrieves data",
    "POST creates new resources",
    "PUT updates existing resources",
    "DELETE removes resources"
  ],
  "resources": [
    {
      "title": "MDN HTTP Methods",
      "link": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods",
      "_id": "679a893cad0abb4004983c73"
    }
  ],
  "course": "65fe12345abc6789def01234",
  "__v": 0,
  "createdAt": "2024-01-29T12:15:24.804Z",
  "updatedAt": "2024-01-29T12:15:24.804Z"
}
```
---

### **🔑 Authentication**
📌 **User Registration:**  
```http
POST /api/auth/register
```
```json
{
  "username": "student123",
  "email": "student@example.com",
  "password": "securepassword"
}
```
📌 **User Login:**  
```http
POST /api/auth/login
```
```json
{
  "email": "student@example.com",
  "password": "securepassword"
}
```
📌 **Response (JWT Token):**  
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---
