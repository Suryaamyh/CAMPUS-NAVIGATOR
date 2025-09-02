
import React, { useState } from 'react';
import { FaPlus, FaTrash, FaTimes, FaChartBar } from 'react-icons/fa';

const AdminPanel = ({ 
  locations, 
  setLocations, 
  isAdmin, 
  toggleAdmin, 
  examSchedules, 
  setExamSchedules 
}) => {
  const [activeTab, setActiveTab] = useState('locations');
  const [newLocation, setNewLocation] = useState({
    name: '',
    lat: '',
    lng: '',
    description: '',
    type: 'academic'
  });
  const [newExam, setNewExam] = useState({
    building: '',
    date: '',
    time: '',
    subject: '',
    room: ''
  });

  const addLocation = () => {
    if (!newLocation.name || !newLocation.lat || !newLocation.lng) return;
    const updatedLocations = {
      ...locations,
      [newLocation.name]: {
        lat: parseFloat(newLocation.lat),
        lng: parseFloat(newLocation.lng),
        description: newLocation.description,
        type: newLocation.type
      }
    };
    setLocations(updatedLocations);
    setNewLocation({ name: '', lat: '', lng: '', description: '', type: 'academic' });
    localStorage.setItem('campus_locations', JSON.stringify(updatedLocations));
  };

  const deleteLocation = (name) => {
    const { [name]: _, ...remaining } = locations;
    setLocations(remaining);
    localStorage.setItem('campus_locations', JSON.stringify(remaining));
  };

  const addExam = () => {
    if (!newExam.building || !newExam.date || !newExam.subject) return;
    const exam = { ...newExam, id: Date.now().toString() };
    setExamSchedules([...examSchedules, exam]);
    setNewExam({ building: '', date: '', time: '', subject: '', room: '' });
    localStorage.setItem('exam_schedules', JSON.stringify([...examSchedules, exam]));
  };

  const deleteExam = (id) => {
    const updated = examSchedules.filter(exam => exam.id !== id);
    setExamSchedules(updated);
    localStorage.setItem('exam_schedules', JSON.stringify(updated));
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Campus Admin Panel</h2>
        <button onClick={toggleAdmin} className="close-admin">
          <FaTimes /> Close Admin
        </button>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'locations' ? 'active' : ''} onClick={() => setActiveTab('locations')}>Manage Locations</button>
        <button className={activeTab === 'exams' ? 'active' : ''} onClick={() => setActiveTab('exams')}>Exam Schedules</button>
        <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>Analytics</button>
      </div>

      {activeTab === 'locations' && (
        <div className="locations-management">
          <h3>Add New Location</h3>
          <div className="location-form">
            <input type="text" placeholder="Building Name" value={newLocation.name} onChange={(e) => setNewLocation({...newLocation, name: e.target.value})} />
            <input type="number" placeholder="Latitude" step="0.000001" value={newLocation.lat} onChange={(e) => setNewLocation({...newLocation, lat: e.target.value})} />
            <input type="number" placeholder="Longitude" step="0.000001" value={newLocation.lng} onChange={(e) => setNewLocation({...newLocation, lng: e.target.value})} />
            <select value={newLocation.type} onChange={(e) => setNewLocation({...newLocation, type: e.target.value})}>
              <option value="academic">Academic</option>
              <option value="residential">Residential</option>
              <option value="administrative">Administrative</option>
              <option value="recreational">Recreational</option>
            </select>
            <textarea placeholder="Description (optional)" value={newLocation.description} onChange={(e) => setNewLocation({...newLocation, description: e.target.value})} />
            <button onClick={addLocation} className="add-btn"><FaPlus /> Add Location</button>
          </div>

          <h3>Existing Locations</h3>
          <div className="locations-list">
            {Object.entries(locations).map(([name, data]) => (
              <div key={name} className="location-card">
                <h4>{name}</h4>
                <p>Coordinates: {data.lat}, {data.lng}</p>
                <p>Type: {data.type}</p>
                {data.description && <p>Description: {data.description}</p>}
                <div className="location-actions">
                  <button onClick={() => deleteLocation(name)} className="delete-btn"><FaTrash /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="exams-management">
          <h3>Add New Exam</h3>
          <div className="exam-form">
            <select value={newExam.building} onChange={(e) => setNewExam({...newExam, building: e.target.value})}>
              <option value="">Select Building</option>
              {Object.keys(locations).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <input type="date" value={newExam.date} onChange={(e) => setNewExam({...newExam, date: e.target.value})} />
            <input type="time" value={newExam.time} onChange={(e) => setNewExam({...newExam, time: e.target.value})} />
            <input type="text" placeholder="Subject" value={newExam.subject} onChange={(e) => setNewExam({...newExam, subject: e.target.value})} />
            <input type="text" placeholder="Room Number" value={newExam.room} onChange={(e) => setNewExam({...newExam, room: e.target.value})} />
            <button onClick={addExam} className="add-btn"><FaPlus /> Add Exam</button>
          </div>

          <h3>Upcoming Exams</h3>
          <div className="exams-list">
            {examSchedules.length === 0 ? <p>No exams scheduled yet.</p> : (
              examSchedules.map(exam => (
                <div key={exam.id} className="exam-card">
                  <h4>{exam.subject}</h4>
                  <p><strong>Building:</strong> {exam.building}</p>
                  <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {exam.time}</p>
                  <p><strong>Room:</strong> {exam.room || 'Not specified'}</p>
                  <button onClick={() => deleteExam(exam.id)} className="delete-btn"><FaTrash /> Delete</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics">
          <h3>Campus Analytics</h3>
          <div className="stats-grid">
            <div className="stat-card"><h4>Total Locations</h4><p>{Object.keys(locations).length}</p></div>
            <div className="stat-card"><h4>Upcoming Exams</h4><p>{examSchedules.length}</p></div>
            <div className="stat-card"><h4>Academic Buildings</h4><p>{Object.values(locations).filter(l => l.type === 'academic').length}</p></div>
            <div className="stat-card"><h4>Other Facilities</h4><p>{Object.values(locations).filter(l => l.type !== 'academic').length}</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
