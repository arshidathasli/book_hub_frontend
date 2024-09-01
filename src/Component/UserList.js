import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, InputGroup } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [statusShowConfirm, setStatusShowConfirm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const isHeadLibrarian = role === 'head_librarian';
  const isLibrarian = role === 'librarian';

  useEffect(() => {
    const fetchUserList = async () => {
      setRole(localStorage.getItem('role'));

      try {
        const response = await fetch('http://127.0.0.1:8000/userlist/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data || []);
          setFilteredUsers(data || []);
        } else {
          console.log('Failed to fetch user list');
        }
      } catch (error) {
        console.error('Error fetching user list:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserList();
  }, []);

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    const updatedDetails = {
      email: selectedUser.email,
      name: selectedUser.name,
      role: selectedUser.role,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/update_profile/${selectedUser.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(updatedDetails)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        ));
        setFilteredUsers(users.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        ));
        setShowUpdateModal(false);
      } else {
        console.log('Failed to update user details');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    try {
      const response = await fetch(`http://127.0.0.1:8000/user_search/?q=${query}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFilteredUsers(data || []);
      } else {
        console.log('Failed to search users');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleStatusChange = async (event) => {
    const token = localStorage.getItem('accessToken')
    const userId = selectedUser.id
    console.log(userId)
    try {
      const response = await fetch(`http://127.0.0.1:8000/deactivate_users/${userId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log('Status changed');
      } else {
        console.log('Failed to search users');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };



  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mt-5">
      <h2>User List</h2>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search users"
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>
      {users.length === 0 ? (
        <div>No users available</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              {(isHeadLibrarian || isLibrarian) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>
                  {isHeadLibrarian ? (
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedUser(user);
                        setStatusShowConfirm(true);
                      }}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Button>
                  ) : (
                    <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                  )}
                </td>
                {(isHeadLibrarian || isLibrarian) && (
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Update Modal */}
      {selectedUser && (
        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser?.name || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedUser?.role || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <option value="patron">Patron</option>
                  <option value="librarian">Librarian</option>
                  <option value="head_librarian">Head Librarian</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateUser}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Set Status Modal */}
      {selectedUser && (
        <Modal show={statusShowConfirm} onHide={() => setStatusShowConfirm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Modal.Title>Are you sure you want to change the status of the user?</Modal.Title>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setStatusShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleStatusChange}>
              Change
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default UserList;
