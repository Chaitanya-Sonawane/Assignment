import React, { useState } from 'react';
import './OverlayList.css';

const OverlayList = ({ overlays, onUpdateOverlay, onDeleteOverlay, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (overlay) => {
    setEditingId(overlay._id);
    setEditData({
      content: overlay.content,
      position: { ...overlay.position },
      size: { ...overlay.size }
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseFloat(value) || 0
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveEdit = async (overlayId) => {
    try {
      await onUpdateOverlay(overlayId, editData);
      setEditingId(null);
      setEditData({});
    } catch (err) {
      console.error('Failed to update overlay:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (overlayId) => {
    if (window.confirm('Are you sure you want to delete this overlay?')) {
      try {
        await onDeleteOverlay(overlayId);
      } catch (err) {
        console.error('Failed to delete overlay:', err);
      }
    }
  };

  if (loading && overlays.length === 0) {
    return <div className="overlay-list loading">Loading overlays...</div>;
  }

  return (
    <div className="overlay-list">
      <h2>Overlays ({overlays.length})</h2>
      
      {overlays.length === 0 ? (
        <p className="no-overlays">No overlays yet. Create one to get started!</p>
      ) : (
        <div className="overlays-grid">
          {overlays.map((overlay) => (
            <div key={overlay._id} className="overlay-card">
              {editingId === overlay._id ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Content:</label>
                    {overlay.type === 'text' ? (
                      <textarea
                        name="content"
                        value={editData.content}
                        onChange={handleEditChange}
                        className="form-control"
                        rows="2"
                      />
                    ) : (
                      <input
                        type="text"
                        name="content"
                        value={editData.content}
                        onChange={handleEditChange}
                        className="form-control"
                      />
                    )}
                  </div>

                  <div className="form-row-small">
                    <div className="form-group-small">
                      <label>X:</label>
                      <input
                        type="number"
                        name="position.x"
                        value={editData.position.x}
                        onChange={handleEditChange}
                        className="form-control-small"
                      />
                    </div>
                    <div className="form-group-small">
                      <label>Y:</label>
                      <input
                        type="number"
                        name="position.y"
                        value={editData.position.y}
                        onChange={handleEditChange}
                        className="form-control-small"
                      />
                    </div>
                  </div>

                  <div className="form-row-small">
                    <div className="form-group-small">
                      <label>W:</label>
                      <input
                        type="number"
                        name="size.width"
                        value={editData.size.width}
                        onChange={handleEditChange}
                        className="form-control-small"
                      />
                    </div>
                    <div className="form-group-small">
                      <label>H:</label>
                      <input
                        type="number"
                        name="size.height"
                        value={editData.size.height}
                        onChange={handleEditChange}
                        className="form-control-small"
                      />
                    </div>
                  </div>

                  <div className="button-group">
                    <button 
                      onClick={() => handleSaveEdit(overlay._id)}
                      className="btn btn-save"
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="btn btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="overlay-header">
                    <span className={`overlay-type-badge ${overlay.type}`}>
                      {overlay.type}
                    </span>
                  </div>
                  
                  <div className="overlay-content-preview">
                    {overlay.type === 'text' ? (
                      <p className="text-preview">{overlay.content}</p>
                    ) : (
                      <div className="image-preview">
                        <img 
                          src={overlay.content} 
                          alt="Preview" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <span className="image-url" style={{ display: 'none' }}>
                          {overlay.content}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="overlay-details">
                    <div className="detail-row">
                      <span className="detail-label">Position:</span>
                      <span className="detail-value">
                        ({overlay.position.x}, {overlay.position.y})
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Size:</span>
                      <span className="detail-value">
                        {overlay.size.width} × {overlay.size.height}
                      </span>
                    </div>
                  </div>

                  <div className="button-group">
                    <button 
                      onClick={() => handleEditClick(overlay)}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(overlay._id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OverlayList;
