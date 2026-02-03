# 🚀 CodeMaster (MERN Stack)

A comprehensive coding platform designed to mimic the core functionality of LeetCode. This application allows users to solve Data Structure and Algorithm problems, compile code, view video solutions, and get real-time assistance from an integrated AI Chatbot.

It includes a robust **Admin Panel** for managing content and utilizes **Redis** for rate limiting to ensure system stability.



---

## 🌟 Key Features

### 👨‍💻 For Users
* **Online Code Compiler:** Supports C++, Java, and JavaScript (integrated with Monaco Editor).
* **AI Chat Assistant:** Get hints, time complexity analysis, and logic help via the `ChatAI` component.
* **Video Solutions:** Watch attached video tutorials for specific problems.
* **Doubt Support:** Dedicated section to raise and resolve doubts.
* **Submission History:** Track past attempts, runtime, and memory usage.
* **Authentication:** Secure Login/Signup with JWT.

### 🛡️ For Admins
* **Dashboard:** specialized `AdminPanel` to manage the platform.
* **CRUD Operations:** Create, Update, and Delete problems (`AdminUpdate`, `AdminDelete`).
* **Media Management:** Upload video solutions directly (`AdminVideo`, `AdminUpload`).

### ⚙️ Backend & Architecture
* **Rate Limiting:** Implemented via Redis to prevent API abuse.
* **Scalable Database:** MongoDB schemas for Users, Problems, Submissions, and Video mapping.
* **Modular Design:** Clean separation of Controllers, Routes, and Middleware.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Vite, Redux Toolkit, Tailwind CSS, Monaco Editor, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Caching** | Redis (for Rate Limiting) |
| **AI Integration** | Gemini/OpenAI API (Backend `aiChat.js`) |
| **Authentication** | JSON Web Tokens (JWT) |

---

## 📂 Project Structure

The project is divided into the main production application and a daily learning log.

```bash
CodeMaster/
├─ Backend/
│  ├─ dummy/
│  │  ├─ problemUtility.js
│  │  ├─ userProblem.js
│  │  └─ userSubmission.js
│  ├─ src/
│  │  ├─ config/
│  │  │  ├─ db.js
│  │  │  └─ redis.js
│  │  ├─ controllers/
│  │  │  ├─ solveDoubt.js
│  │  │  ├─ userAuthenticate.js
│  │  │  ├─ userProblem.js
│  │  │  ├─ userSubmission.js
│  │  │  └─ videoSection.js
│  │  ├─ middleware/
│  │  │  ├─ adminMiddleware.js
│  │  │  ├─ submitRateLimiter.js
│  │  │  └─ userMiddleware.js
│  │  ├─ models/
│  │  │  ├─ problem.js
│  │  │  ├─ solutionVideo.js
│  │  │  ├─ submission.js
│  │  │  └─ user.js
│  │  ├─ routes/
│  │  │  ├─ aiChat.js
│  │  │  ├─ problemCreater.js
│  │  │  ├─ submit.js
│  │  │  ├─ userAuth.js
│  │  │  └─ videoCreator.js
│  │  ├─ utils/
│  │  │  ├─ problemUtility.js
│  │  │  ├─ validator.js
│  │  │  └─ wrappers.js
│  │  └─ index.js
│  ├─ .env
│  ├─ .gitignore
│  ├─ package-lock.json
│  ├─ package.json
│  └─ test.js
├─ FrontEnd/
│  ├─ public/
│  │  └─ vite.svg
│  ├─ src/
│  │  ├─ assets/
│  │  │  └─ react.svg
│  │  ├─ components/
│  │  │  ├─ AdminDelete.jsx
│  │  │  ├─ AdminPanel.jsx
│  │  │  ├─ AdminUpdate.jsx
│  │  │  ├─ AdminUpload.jsx
│  │  │  ├─ AdminVideo.jsx
│  │  │  ├─ ChatAI.jsx
│  │  │  ├─ Editorials.jsx
│  │  │  └─ SubmissionHistory.jsx
│  │  ├─ pages/
│  │  │  ├─ Admin.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ ProblemPage.jsx
│  │  │  ├─ Signup.jsx
│  │  │  └─ Update.jsx
│  │  ├─ slices/
│  │  │  ├─ authSlice.js
│  │  │  └─ authSlice1.js
│  │  ├─ store/
│  │  │  └─ store.js
│  │  ├─ utils/
│  │  │  └─ axiosClient.js
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ .gitignore
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  └─ vite.config.js
└─ .gitignore
```

cd Backend

# Install dependencies
npm install

 Configure Environment Variables
 Create a .env file in the Backend directory and add:
 PORT=3000
 MONGO_URI=your_mongodb_connection_string
 REDIS_URL=your_redis_connection_string
 JWT_SECRET=your_jwt_secret
 AI_API_KEY=your_gemini_or_openai_key

# Start the server
npm start

cd FrontEnd

# Install dependencies
npm install

 Configure Environment Variables
 Create a .env file in the FrontEnd directory and add:
 VITE_BACKEND_URL=http://localhost:3000

# Run the development server
npm run dev

🔌 API Documentation Highlights
Method,Endpoint,Description,Access
POST,/api/auth/login,User Login,Public
POST,/api/submit,Submit code solution,User
POST,/api/ai-chat,Ask AI a question,User
POST,/api/problem/create,Create a new problem,Admin
POST,/api/video/upload,Upload solution video,Admin
GET,/api/submission/history,Get user submissions,User

🤝 Contribution
Contributions are welcome! If you'd like to improve the AI logic, add more test cases, or refine the UI:

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request
