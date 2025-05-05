// contact.js
import React, { useEffect, useState } from 'react';
import './Contacts.css';
import { useNavigate } from 'react-router-dom';

function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
 
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    personalEmail: '',
    workEmail: '',
    homePhone: '',
    title: '',
    workPhone: ''
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state
  const [editContactId, setEditContactId] = useState(null);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username'); 

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetch('http://localhost:8080/api/contacts', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) throw new Error("Unauthorized or failed fetch.");
        return response.json();
      })
      .then(data => {
        console.log("Fetched contacts:", data);
        if (Array.isArray(data)) {
          setContacts(data);
        } else {
          console.error("Fetched data is not an array", data);
        }
        setLoading(false); // Stop loading
      })
      .catch(error => {
        console.error('Error fetching contacts:', error.message);
        setError('Failed to fetch contacts.');
        setLoading(false); // Stop loading
      });
  }, [token]);

  const handleEditContact = (contact) => {
    if (!contact) return;
  
    setNewContact({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      personalEmail: contact.personalEmail || '',
      workEmail: contact.workEmail || '',
      homePhone: contact.homePhone || '',
      title: contact.title || '',
      workPhone: contact.workPhone || ''
    });
  
    setEditContactId(contact.id);
    setShowForm(true);
  };
  

  const handleSaveContact = async () => {
    if (!newContact.firstName || !newContact.lastName) {
      alert("First Name and Last Name are required.");
      return;
    }

    const url = editContactId
      ? `http://localhost:8080/api/contacts/${editContactId}`
      : 'http://localhost:8080/api/contacts';

    const method = editContactId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newContact,
          id: editContactId  // 👈 ensure id is sent during PUT
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save contact.");
      }

      if (editContactId) {
        setContacts(prev =>
          prev.map(c => (c.id === editContactId ? data : c))
        );
      } else {
        setContacts(prev => [...prev, data]);
      }

      setShowForm(false);
      setEditContactId(null);
      setNewContact({
        firstName: '',
        lastName: '',
        personalEmail: '',
        workEmail: '',
        homePhone: '',
        title: '',
        workPhone: ''
      });
    } catch (error) {
      console.error("Error saving contact:", error.message);
      alert(error.message);
    }
  };
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };
  const handleResetContact = () => {
    setNewContact({
      firstName: '',
      lastName: '',
      personalEmail: '',
      workEmail: '',
      homePhone: '',
      title: '',
      workPhone: ''
    });
    setEditContactId(null);
  };
  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact permanently?")) return;
  
    try {
      const response = await fetch(`http://localhost:8080/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete contact");
      }
  
      setContacts(prev => prev.filter(contact => contact.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert(`An unexpected error occurred: ${error.message}`);
    }
  };
  
  
  

  const handleCreateContact = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditContactId(null);
    setNewContact({
      firstName: '',
      lastName: '',
      personalEmail: '',
      workEmail: '',
      homePhone: '',
      title: '',
      workPhone: ''
    });


  
  };

  
  return (
    <div className="contacts-page">
    {/* Top Bar with Username */}
    <div className="top-bar">
  <div className="company-name">Contact Management System</div>
  <div className="user-info">
    <span className="username">{username ? username : 'Guest'}</span>
    <img
      src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
      alt="User Icon"
      className="user-icon " 
    />
    
  </div>
  <button className="logout-button" onClick={handleLogout}>Logout</button>
</div>

    
     

        
{loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="contacts-header">
          <div className="contacts-counts"> Contacts: ({contacts.length})</div>
          
          <button onClick={handleCreateContact} className="create-contact-btn">
            <span className="plus">+</span>
            <span className="text">Create</span>
            <span className="hover-text">Create New Contact</span>
          </button>
        </div>
        <div className="contacts-scrollable-section">
<div className="contacts-grid">
          {contacts.length > 0 ? (
            contacts.map(contact => (
              <div key={contact.id} className="contact-card">
                <p><strong>{contact.firstName} {contact.lastName}</strong></p>
                <p>Personal Email: {contact.personalEmail}</p>
                <p>Work Email: {contact.workEmail}</p>
                <p>Home Phone: {contact.homePhone}</p>
                <p>Title: {contact.title}</p>
                <p>Work Phone: {contact.workPhone}</p>
                <div className="card-actions">
                  <button onClick={() => handleEditContact(contact)}>✏️ Edit</button>
                  <button onClick={() => handleDeleteContact(contact.id)}>🗑️ Delete</button>
                </div>
              </div>
           

            ))
          ) : (
            <div class="no-contacts-message">
  <h3>No Contacts Found!</h3>
  <p>It looks like you haven't created any contacts yet.</p>
  <p>Start by creating new contacts to keep track of them easily.</p>
  
</div>
          )}
        </div>
        </div>
        {showForm && <div className="overlay visible"></div>}

<div className={`contacts-list ${showForm ? 'fade' : ''}`}>
  {showForm && (
    <div className="contact-form-container">
      <div className="close-form" onClick={handleCancelForm}>&times;</div>
      <div className="contact-form">
        <div className="form-row">
        <p className="typing-heading">Add New Contacts</p>
          <input
            type="text"
            placeholder="First Name *"
            value={newContact.firstName}
            onChange={e => setNewContact({ ...newContact, firstName: e.target.value })}
            autoFocus
            required
          />
          <input
            type="text"
            placeholder="Last Name *"
            value={newContact.lastName}
            onChange={e => setNewContact({ ...newContact, lastName: e.target.value })}
            required
          />
        </div>
        <input
          type="email"
          placeholder="Personal Email"
          value={newContact.personalEmail}
          onChange={e => setNewContact({ ...newContact, personalEmail: e.target.value })}
        />
        <input
          type="email"
          placeholder="Work Email"
          value={newContact.workEmail}
          onChange={e => setNewContact({ ...newContact, workEmail: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Home Phone"
          value={newContact.homePhone}
          onChange={e => setNewContact({ ...newContact, homePhone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Title"
          value={newContact.title}
          onChange={e => setNewContact({ ...newContact, title: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Work Phone"
          value={newContact.workPhone}
          onChange={e => setNewContact({ ...newContact, workPhone: e.target.value })}
        />


<button className="button" button onClick={handleSaveContact}>
{editContactId ? '' : ''}
<svg class="svgIcon" viewBox="0 0 384 512">
<path
d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
></path>
</svg>

</button>

<button className="button2" onClick={handleResetContact}>
<svg className="svgIcon2" viewBox="0 0 512 512">
<path d="M256 48C141.1 48 48 141.1 48 256c0 27.5 5.3 53.7 14.8 77.7L24.2 408c-4.4 11.3 6.5 22.2 17.8 17.8l74.3-38.6c23.8 9.4 50.1 14.8 78.7 14.8 114.9 0 208-93.1 208-208S370.9 48 256 48zM142 256c0-62.1 50.4-112.5 112.5-112.5S367 193.9 367 256s-50.4 112.5-112.5 112.5S142 318.1 142 256z"/>
</svg>
</button>


      </div>
    </div>
  )}
      </div>
    </div>
  );
}

export default Contacts;
