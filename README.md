# 🚀 TaskZen 

## 📌 Overview

TaskZen is a full-stack web application that allows users to efficiently manage tasks with AI-powered prioritization, authentication via Google/GitHub, and real-time task updates.

🔗 **Live App:** [TaskZen ](https://taskzen-13cvgn456-bhavneet345s-projects.vercel.app)

🔧 **Backend API:** [TaskZen API](https://taskzen-7vws.onrender.com/)

---

## ✨ Features

- ✅ **User Authentication**: Login and register via Google, GitHub, or email/password.
- 📝 **Task Management**: Create, update, delete, and view tasks in real time.
- 🔄 **AI-Powered Prioritization**: Get tasks sorted by AI based on priority & urgency.
- 📅 **Due Dates & Priorities**: Assign deadlines and priority levels to tasks.
- 📊 **Task Status Tracking**: Mark tasks as To-Do, In Progress, or Completed.
- 🎨 **Modern UI**: Built with Next.js, Tailwind CSS, and React components.

---

## 🛠️ Tech Stack

### **Frontend** (React + Next.js)

- **Framework:** Next.js 13 (App Router)
- **UI Library:** Tailwind CSS, Radix UI
- **State Management:** React Hooks
- **Authentication:** NextAuth.js, OAuth (Google & GitHub)
- **API Requests:** Fetch API with JWT Authentication
- **Hosting:** Vercel

### **Backend** (Node.js + Express)

- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** Passport.js (Google & GitHub OAuth)
- **Task Prioritization:** AI-powered Spring Boot API integration
- **Hosting:** Render.com (for Node.js API)

---

## 📦 Installation & Setup

### **1️⃣ Clone the Repository**

```sh
 git clone https://github.com/YOUR_GITHUB_USERNAME/smart-task-manager.git
 cd smart-task-manager
```

### **2️⃣ Setup Environment Variables**

Create a `.env` file in both **frontend** and **backend** directories and add:

#### \*\*Frontend \*\*\`\`

```
NEXT_PUBLIC_API_BASE_URL=https://taskzen-7vws.onrender.com
```

#### \*\*Backend \*\*\`\`

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### **3️⃣ Install Dependencies**

```sh
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### **4️⃣ Run the Application**

```sh
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

🔹 The frontend runs at `http://localhost:3000`\
🔹 The backend runs at `http://localhost:5001`

---

## 🔥 API Endpoints

### **Authentication**

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user with email & password
- `GET /api/auth/google` - Google OAuth Login
- `GET /api/auth/github` - GitHub OAuth Login

### **Task Management**

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Fetch all tasks
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/prioritize` - Get AI-prioritized tasks

---

## 🛑 Troubleshooting

If you encounter issues:

- **Login Issues?** Ensure the correct redirect URIs are set in Google & GitHub OAuth settings.
- **Task Not Updating in Real-time?** Ensure `useEffect(fetchTasks, [])` is used properly.
- **AI Prioritization Not Working?** Check your Spring Boot API logs for errors.

---

## 🤝 Contributing

Feel free to contribute by submitting a PR! Open issues if you find bugs or have feature suggestions.

---

## 🎯 Contact

For questions or collaborations, reach out via GitHub Issues or Email: `bhavneetsingh2024@gmail.com`

