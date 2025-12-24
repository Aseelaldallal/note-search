# File Upload Application

A modern file upload application built with React and TypeScript (frontend) and Node.js/Express with TypeScript (backend).

## Features

- **Drag & Drop Interface**: Easily drag and drop files or click to select
- **Multiple File Support**: Upload multiple files at once
- **Real-time File Preview**: See files before uploading with file size information
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, gradient-based design with smooth animations

## Project Structure

```
.
├── backend/          # Node.js Express TypeScript server
│   ├── src/
│   │   └── server.ts # Express server with upload endpoint
│   ├── dist/         # Compiled JavaScript (generated)
│   ├── tsconfig.json # TypeScript configuration
│   └── package.json  # Backend dependencies
│
├── frontend/         # React TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.tsx    # Main file upload component
│   │   │   └── FileUpload.css    # Component styles
│   │   ├── App.tsx               # Main app component
│   │   ├── App.css               # App styles
│   │   └── index.tsx             # Entry point
│   └── package.json              # Frontend dependencies
│
└── README.md         # This file
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** with a database called `note_search` and the **pgvector** extension installed

To check if you have Node.js and npm installed, run:
```bash
node --version
npm --version
```

To create the database and enable pgvector:
```bash
createdb note_search
psql -d note_search -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

## Installation & Setup

### Step 1: Install Backend Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### Step 2: Run Setup (Migrations + Queues)

Make sure you have created the database and enabled pgvector (see Prerequisites), then run:

```bash
cd backend
npm run setup
```

This runs database migrations and creates the required job queues.

### Step 3: Install Frontend Dependencies

Open a new terminal window/tab, navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

## Running the Application

You need to run both the backend server and the frontend application.

### Step 1: Start the Backend Server

In the backend directory, you have two options:

**Option A: Development Mode (Recommended)**
```bash
cd backend
npm run dev
```

The backend server will start on **http://localhost:5001**

You should see:
```
Server is running on port 5001
Visit http://localhost:5001
```

### Step 2: Start the Frontend Application

In a **new terminal window/tab**, navigate to the frontend directory:

```bash
cd frontend
npm start
```

The React application will start and automatically open in your browser at **http://localhost:3000**

If it doesn't open automatically, manually open your browser and go to http://localhost:3000

## How to Use

1. **Start both servers**: Make sure both the backend (port 5001) and frontend (port 3000) are running
2. **Open the application**: Go to http://localhost:3000 in your browser
3. **Upload files**:
   - Drag and drop files onto the upload area, OR
   - Click the "Select Files" button to choose files from your computer
4. **Review files**: See the list of files you're about to upload with their sizes
5. **Remove files**: Click the × button next to any file to remove it from the upload list
6. **Upload**: Click the "Upload X file(s)" button to send files to the server
7. **View uploaded files**: Successfully uploaded files will appear in the "Uploaded Files" section

## Development

### Backend Development

The backend server uses TypeScript with nodemon and ts-node for development. To run in development mode:

```bash
cd backend
npm run dev
```

This will automatically restart the server when you make changes to TypeScript files in the `src` directory.

To watch TypeScript compilation in a separate terminal:
```bash
cd backend
npm run dev:build
```

### Frontend Development

The React development server (started with `npm start`) automatically reloads when you make changes to the frontend code.

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript with strong typing
- **CORS**: Cross-Origin Resource Sharing middleware
- **ts-node**: TypeScript execution for Node.js

### Frontend
- **React**: UI library
- **TypeScript**: Type-safe JavaScript with strong typing
- **CSS3**: Modern styling with gradients and animations


## License

This is a sample application for educational purposes.