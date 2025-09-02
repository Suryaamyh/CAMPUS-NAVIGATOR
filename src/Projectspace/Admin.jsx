import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './admin.module.css';

const searchFields = [
  { label: 'Hall Ticket', value: 'hallTicket' },
  { label: 'Name', value: 'name' },
  { label: 'Exam', value: 'exam' },
  { label: 'Block', value: 'block' },
  { label: 'Room', value: 'room' },
  { label: 'Date', value: 'date' }
];

const AdminPage = () => {
  const [formData, setFormData] = useState({ hallTicket: '', name: '', exam: '', block: '', room: '', date: '' });
  const [entries, setEntries] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const itemsPerPage = 10;

  const fetchEntries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/entries');
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleFormChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleManualSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (imageFile) data.append('photo', imageFile);
    const res = await fetch('http://localhost:5000/api/entries/manual-entry', {
      method: 'POST',
      body: data
    });
    setMessage(await res.text());
    fetchEntries();
  };

  const handleExcelSubmit = async () => {
    const formData = new FormData();
    formData.append('file', excelFile);
    const res = await fetch('http://localhost:5000/api/entries/upload-excel', {
      method: 'POST',
      body: formData
    });
    setMessage(await res.text());
    fetchEntries();
  };

  const handleDelete = async id => {
    await fetch(`http://localhost:5000/api/entries/entry/${id}`, { method: 'DELETE' });
    fetchEntries();
  };

  const handleUpdate = async id => {
    const entry = entries.find(e => e._id === id);
    await fetch(`http://localhost:5000/api/entries/entry/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    setEditId(null);
    fetchEntries();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Exam', 'Room', 'Block', 'Date']],
      body: entries.map(e => [e.name, e.exam, e.room, e.block, e.date])
    });
    doc.save('export.pdf');
  };

  const handleChangeField = (id, field, value) => {
    setEntries(prev => prev.map(e => e._id === id ? { ...e, [field]: value } : e));
  };

  const toggleSelect = id => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkUpdate = async () => {
    for (let id of selectedIds) {
      const entry = entries.find(e => e._id === id);
      await fetch(`http://localhost:5000/api/entries/entry/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    }
    setSelectedIds([]);
    fetchEntries();
  };

  const filteredEntries = entries.filter(e =>
    e[searchBy]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Admin Dashboard</h2>

      <form className={styles.form} onSubmit={handleManualSubmit}>
        <input type="text" name="hallTicket" placeholder="Hall Ticket" onChange={handleFormChange} required />
        <input type="text" name="name" placeholder="Name" onChange={handleFormChange} required />
        <input type="text" name="exam" placeholder="Exam" onChange={handleFormChange} required />
        <input type="text" name="block" placeholder="Block" onChange={handleFormChange} required />
        <input type="text" name="room" placeholder="Room" onChange={handleFormChange} required />
        <input type="date" name="date" onChange={handleFormChange} required />
        <input type="file" onChange={e => setImageFile(e.target.files[0])} />
        <button type="submit" className={styles.button}>Submit Entry</button>
      </form>

      <div className={styles.form}>
        <input type="file" onChange={e => setExcelFile(e.target.files[0])} />
        <button onClick={handleExcelSubmit} className={styles.button}>Upload File</button>
        <button onClick={handleExportPDF} className={styles.button}>Download PDF</button>
      </div>

      <div className={styles.form}>
        <button onClick={() => setShowTable(true)} className={styles.button}>Show Data</button>
        {showTable && <button onClick={() => setShowTable(false)} className={styles.button}>Close</button>}
      </div>

      {showTable && (
        <div className={`${styles.tableWrapper} ${styles.fadeIn}`}>
          <div className={styles.filters}>
            <select value={searchBy} onChange={e => setSearchBy(e.target.value)}>
              {searchFields.map(field => (
                <option key={field.value} value={field.value}>{field.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchBy}`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th><input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? entries.map(e => e._id) : [])} /></th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Exam</th>
                  <th>Room</th>
                  <th>Block</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.map(entry => (
                  <tr key={entry._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(entry._id)}
                        onChange={() => toggleSelect(entry._id)}
                      />
                    </td>
                    <td>
                      {entry.photo ? (
                        <img src={`http://localhost:5000${entry.photo}`} alt="entry" className={styles.photo} />
                      ) : 'No photo'}
                    </td>
                    <td>{(editId === entry._id || selectedIds.includes(entry._id)) ? <input value={entry.name} onChange={e => handleChangeField(entry._id, 'name', e.target.value)} /> : entry.name}</td>
                    <td>{(editId === entry._id || selectedIds.includes(entry._id)) ? <input value={entry.exam} onChange={e => handleChangeField(entry._id, 'exam', e.target.value)} /> : entry.exam}</td>
                    <td>{(editId === entry._id || selectedIds.includes(entry._id)) ? <input value={entry.room} onChange={e => handleChangeField(entry._id, 'room', e.target.value)} /> : entry.room}</td>
                    <td>{(editId === entry._id || selectedIds.includes(entry._id)) ? <input value={entry.block} onChange={e => handleChangeField(entry._id, 'block', e.target.value)} /> : entry.block}</td>
                    <td>{(editId === entry._id || selectedIds.includes(entry._id)) ? <input value={entry.date} onChange={e => handleChangeField(entry._id, 'date', e.target.value)} /> : entry.date}</td>
                    <td>
                      {editId === entry._id ? (
                        <>
                          <button onClick={() => handleUpdate(entry._id)} className={styles.button}>Save</button>
                          <button onClick={() => setEditId(null)} className={styles.button}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditId(entry._id)} className={styles.button}>Edit</button>
                          <button onClick={() => handleDelete(entry._id)} className={styles.button}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedIds.length > 0 && (
            <div className={styles.form}>
              <button onClick={handleBulkUpdate} className={styles.button}>Bulk Update</button>
              <button onClick={() => selectedIds.forEach(handleDelete)} className={styles.button}>Bulk Delete</button>
            </div>
          )}

          <div className={styles.pagination}>
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => (p * itemsPerPage < filteredEntries.length ? p + 1 : p))}
              disabled={currentPage * itemsPerPage >= filteredEntries.length}
            >Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
