import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Component/Login';
import Signup from './Component/Signup';
import PatronPage from './Component/PatronPage';
import LibrarianPage from './Component/LibrarianPage';
import Profile from './Component/Profile';
import BookList from './Component/BookList';
import UserList from './Component/UserList';
import { useAuth } from './Component/useAuth';
import Logout from './Component/Logout';

function App() {
  const { isAuthenticated, role } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate replace to={`/${role}_Page`} /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate replace to={`/${role}_Page`} /> : <Signup />} />
        <Route path="/patron_Page" element={isAuthenticated && role === 'patron' ? <PatronPage /> : <Navigate replace to="/login" />} />
        <Route path="/librarian_Page" element={isAuthenticated && (role === 'librarian' || role === 'head_librarian') ? <LibrarianPage /> : <Navigate replace to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate replace to="/login" />} />
        <Route path="/booklist" element={isAuthenticated ? <BookList /> : <Navigate replace to="/login" />} />
        <Route path="/userlist" element={isAuthenticated && (role === 'librarian' || role === 'head_librarian') ? <UserList /> : <Navigate replace to="/login" />} />
        <Route path="/head_librarian_Page" element={isAuthenticated && (role === 'librarian' || role === 'head_librarian') ? <LibrarianPage /> : <Navigate replace to="/login" />} />
        <Route path="/logout" element= {<Logout />} />
        
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
