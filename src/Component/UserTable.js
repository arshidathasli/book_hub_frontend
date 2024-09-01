import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function UserTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [update, setUpdate] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.get('http://127.0.0.1:8000/userlist/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false); 
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false); 
      });
    } else {
      setError('No token found. Please log in.');
      setLoading(false);
    }
  }, []);

  const updateDetails = (id) => {
    axios
      .get(`http://127.0.0.1:8000/api/userlist/${id}/`)
      .then(response => setUpdate(response.data))
      .catch(error => console.error('Error fetching user details:', error));
  };

  const handleInputChange = (event, fieldName) => {
    const value = event.target.value;
    setUpdate((prevUpdate) => ({
      ...prevUpdate,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requestData = {
      email: update.email,
      name: update.name,
      role: update.role,
    };
  
    try {
      const response = await axios.put(`http://127.0.0.1:8000/update_profile/${update.id}/`, requestData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (response.status === 200) {
        console.log("User profile updated successfully:", response.data);
        // Optionally, refresh the list or close the modal
        // Refresh user list after successful update
        setData((prevData) =>
          prevData.map((user) =>
            user.id === update.id ? { ...user, ...response.data } : user
          )
        );
      } else {
        console.error("Failed to update profile:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while updating the profile:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  
  return (
    <div className='container-lg p-5'>
      <h3 className='text-center'> User Table</h3>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">EMAIL</th>
            <th scope="col">NAME</th>
            <th scope="col">ROLE</th>
            <th scope="col">OPERATIONS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <th scope="row">{item.id}</th>
              <td>{item.email}</td>
              <td>{item.name}</td>
              <td>{item.role}</td>
              <td>
                <button 
                  className='btn btn-success'
                  onClick={() => updateDetails(item.id)} 
                  data-bs-toggle="modal" 
                  data-bs-target="#updateModal"
                >
                  Update
                </button>
                <button 
                  className='btn btn-danger' 
                  data-bs-toggle="modal" 
                  data-bs-target={`#deleteModal-${item.id}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Modal */}
      <div 
        className="modal fade" 
        id="updateModal" 
        tabIndex="-1" 
        aria-labelledby="updateModalLabel" 
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">Update User {update.id}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className='form-group'>
                  <label>EMAIL</label>
                  <input 
                    type='text' 
                    className='form-control' 
                    value={update.email || ''} 
                    onChange={(event) => handleInputChange(event, 'email')}
                  />
                </div>
                <div className='form-group'>
                  <label>NAME</label>
                  <input 
                    type='text' 
                    className='form-control' 
                    value={update.name || ''} 
                    onChange={(event) => handleInputChange(event, 'name')}
                  />
                </div>
                <div className='form-group'>
                  <label>ROLE</label>
                  <input 
                    type='text' 
                    className='form-control' 
                    value={update.role || ''} 
                    onChange={(event) => handleInputChange(event, 'role')}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modals for each user */}
      {data.map((item) => (
        <div 
          key={`deleteModal-${item.id}`}
          className="modal fade" 
          id={`deleteModal-${item.id}`} 
          tabIndex="-1" 
          aria-labelledby="deleteModalLabel" 
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">Delete User {item.id}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete user {item.name}?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserTable;

