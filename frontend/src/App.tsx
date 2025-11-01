import React from 'react';
import './App.css';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>File Upload Portal</h1>
          <p>Upload your files securely and easily</p>
        </header>
        <main className="app-main">
          <FileUpload />
        </main>
      </div>
    </div>
  );
}

export default App;
