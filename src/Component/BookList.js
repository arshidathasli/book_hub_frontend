import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function BookList() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const navigate = useNavigate();
  const [allBooks, setAllBooks] = useState([]); // State to hold all books
  const [displayedBooks, setDisplayedBooks] = useState([]); // State to hold currently displayed books

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/booklist/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDisplayedBooks(data.books || []);  // Ensure 'books' is accessed correctly
        setRole(data.current_user_role || '');  // Ensure 'current_user_role' is accessed correctly
      } else {
        console.log('Failed to fetch books');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearchChange = async (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    try {
      const response = await fetch(`http://127.0.0.1:8000/search_book/?q=${searchValue}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDisplayedBooks(data); // Show filtered books based on the search
      } else {
        console.error('Failed to fetch search results');
      }
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };


  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete_book/${selectedBookId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        setBooks(books.filter(book => book.id !== selectedBookId));
        setShowModal(false);  // Close the modal
        alert('Book deleted successfully.');
        fetchBooks();
      } else {
        alert('Failed to delete book.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting book.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/add_book/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author, isbn })
      });

      if (response.ok) {
        alert('Book added successfully.');
        setShowAddBookForm(false); // Close the modal
        setTitle('');
        setAuthor('');
        setIsbn('');
        // Optionally update state or fetch books again
      } else {
        alert('Failed to add book.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding book.');
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/update_book/${selectedBookId}/`, {
        method: 'PUT',  // Correct method for updating
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author, isbn })
      });
  
      if (response.ok) {
        alert('Book updated successfully.');
        setShowUpdateModal(false); // Close the modal
        setTitle('');
        setAuthor('');
        setIsbn('');
        fetchBooks();
        // Optionally update state or fetch books again
      } else {
        alert('Failed to update book.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating book.');
    }
  };

  const openUpdateModal = async (bookId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/book/${bookId}/`, { // Use the correct endpoint here
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
  
      if (response.ok) {
        const book = await response.json();
        setTitle(book.title);
        setAuthor(book.author);
        setIsbn(book.isbn);
        setSelectedBookId(bookId);
        setShowUpdateModal(true);
      } else {
        alert('Failed to fetch book details.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching book details.');
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Book List</h2>
      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search for books..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {(role === 'head_librarian' || role === 'librarian') && (
          <>
            <Button
              variant="primary"
              className="mt-3"
              onClick={() => setShowAddBookForm(true)}
            >
              Add Book
            </Button>
          </>
        )}
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            {(role === 'head_librarian' || role === 'librarian') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {displayedBooks.length > 0 ? (
            displayedBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                {(role === 'head_librarian' || role === 'librarian') && (
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => openUpdateModal(book.id)}
                    >
                      Update
                    </Button>
                    {role === 'head_librarian' && (
                      <Button
                        variant="danger"
                        onClick={() => {
                          setSelectedBookId(book.id);
                          setShowModal(true);
                        }}
                        className="ml-2"
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No books found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Adding Book */}
      <Modal show={showAddBookForm} onHide={() => setShowAddBookForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formIsbn">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddBookForm(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Add Book
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Confirming Deletion */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this book?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Updating Book */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formIsbn">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Update Book
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default BookList;
