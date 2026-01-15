import React, { useState } from 'react';
import './OverlayManager.css';

const OverlayManager = ({ onCreateOverlay, loading }) => {
  const [formData, setFormData] = useState({
    type: 'text',
    content: '',
    position: { x: 50, y: 50 },
    size: { width: 200, height: 100 }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    try {
      await onCreateOverlay(formData);
      setSuccess('Overlay created successfully!');
      
      // Reset form
      setFormData({
        type: 'text',
        content: '',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 100 }
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create overlay');
    }
  };

  return (
    <div className="overlay-manager">
      <h2>Create New Overlay</h2>
      
      <form onSubmit={handleSubmit} className="overlay-form">
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">
            {formData.type === 'text' ? 'Text Content:' : 'Image URL:'}
          </label>
          {formData.type === 'text' ? (
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter text to display..."
              className="form-control"
              rows="3"
            />
          ) : (
            <input
              type="text"
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter image URL..."
              className="form-control"
            />
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="position.x">Position X:</label>
            <input
              type="number"
              id="position.x"
              name="position.x"
              value={formData.position.x}
              onChange={handleInputChange}
              className="form-control"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position.y">Position Y:</label>
            <input
              type="number"
              id="position.y"
              name="position.y"
              value={formData.position.y}
              onChange={handleInputChange}
              className="form-control"
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="size.width">Width:</label>
            <input
              type="number"
              id="size.width"
              name="size.width"
              value={formData.size.width}
              onChange={handleInputChange}
              className="form-control"
              min="50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="size.height">Height:</label>
            <input
              type="number"
              id="size.height"
              name="size.height"
              value={formData.size.height}
              onChange={handleInputChange}
              className="form-control"
              min="30"
            />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Overlay'}
        </button>
      </form>
    </div>
  );
};

export default OverlayManager;
