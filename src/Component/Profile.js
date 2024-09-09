import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function Profile() {
  const [user, setUser] = useState({
    id: '',
    email: '',
    name: '',
    role: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    email: '',
    name: '',
    role: ''
  });

  // Fetch existing user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/update_profile_self/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Set fetched data to both user and updatedUser states
          setUser(data);
          setUpdatedUser({
            email: data.email || '',
            name: data.name || '',
            role: data.role || '',
          });
        } else {
          console.log('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserData();
  }, []);

  // Show and hide modal functions
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Handle changes in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  // Save updated profile changes
  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/update_profile_self/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(updatedUser)
      });

      if (response.ok) {
        const data = await response.json();
        // Update user state with the response data
        setUser(data);
        handleCloseModal(); // Close the modal after saving changes
      } else {
        console.log('Failed to update user data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">ID: {user.id}</h5>
          <p className="card-text"><strong>Email:</strong> {user.email}</p>
          <p className="card-text"><strong>Name:</strong> {user.name}</p>
          <p className="card-text"><strong>Role:</strong> {user.role}</p>
          <Button variant="primary" onClick={handleShowModal}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Modal for editing user credentials */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={updatedUser.role}
                onChange={handleChange}
                placeholder="Enter your role"
                readOnly // Optional: make role read-only if not meant to be editable
                disabled
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Profile;
