
How to run this MERN Stack Forget Password with OTP project

1. Backend Setup
-----------------
- Go to the 'backend' folder:
  cd backend
- Run: npm install express nodemailer mongoose dotenv cors
- Create a .env file and set:
  MONGO_URI=<Your MongoDB URI>
  EMAIL=<Your Gmail>
  PASS=<Your Gmail Password>
- Run backend:
  node server.js

2. Frontend Setup
-----------------
- Go to 'frontend' folder
  cd frontend
- Create React app if not already:
  npx create-react-app .
- Replace src folder with given one
- Run frontend:
  npm start

Now you can access it at http://localhost:3000
