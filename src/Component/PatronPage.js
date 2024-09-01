import React from 'react';
import { Link } from 'react-router-dom';

function PatronPage() {
  return (
    <div className="container mt-5">
      <h2>Welcome to the Patron Page</h2>
      <div className="mt-3">
        <Link to="/profile" className="btn btn-primary">
          Go to Profile
        </Link>
      </div>
      <div className="mt-3">
        <Link to="/booklist" className="btn btn-primary">
          View Book List
        </Link>
      </div>
    </div>
  );
}

export default PatronPage;