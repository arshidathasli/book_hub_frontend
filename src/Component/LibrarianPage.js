import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';


function LibrarianPage() {

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  return (
    <div className="container mt-5">
      <button onClick={handleLogout}>Logout</button>
      <h2>Librarian Dashboard</h2>
      <div className="d-flex flex-column">
        <Button variant="primary" className="mb-3">
          <Link to="/userlist" className="text-white" style={{ textDecoration: 'none' }}>
            User List
          </Link>
        </Button>
        <Button variant="primary" className="mb-3">
          <Link to="/booklist" className="text-white" style={{ textDecoration: 'none' }}>
            Book List
          </Link>
        </Button>
        <Button variant="primary" className="mb-3">
          <Link to="/profile" className="text-white" style={{ textDecoration: 'none' }}>
            Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default LibrarianPage;
