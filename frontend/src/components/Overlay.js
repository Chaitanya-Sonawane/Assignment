import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import './Overlay.css';

const Overlay = ({ overlay, onUpdate, containerRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(overlay.content);
  const overlayRef = useRef(null);

  // Handle drag events
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (e, data) => {
    setIsDragging(false);
    
    // Update position in backend
    const newPosition = {
      x: Math.round(data.x),  // Round to integer
      y: Math.round(data.y)   // Round to integer
    };

    onUpdate(overlay._id, { position: newPosition });
  };

  // Handle resize (simplified - using mouse events)
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) {
      setIsResizing(true);
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = overlay.size.width;
      const startHeight = overlay.size.height;

      const handleMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        
        const newWidth = Math.max(50, startWidth + deltaX);
        const newHeight = Math.max(30, startHeight + deltaY);

        // Update size immediately for visual feedback
        if (overlayRef.current) {
          overlayRef.current.style.width = `${newWidth}px`;
          overlayRef.current.style.height = `${newHeight}px`;
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        
        // Get final dimensions and update backend
        if (overlayRef.current) {
          const rect = overlayRef.current.getBoundingClientRect();
          const newSize = {
            width: Math.round(rect.width),  // Round to integer
            height: Math.round(rect.height)  // Round to integer
          };
          
          onUpdate(overlay._id, { size: newSize });
        }

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  // Handle content editing
  const handleEditSubmit = () => {
    if (editContent.trim() !== overlay.content) {
      onUpdate(overlay._id, { content: editContent.trim() });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditContent(overlay.content);
    setIsEditing(false);
  };

  const overlayStyle = {
    width: `${overlay.size.width}px`,
    height: `${overlay.size.height}px`,
    fontSize: overlay.type === 'text' ? '16px' : 'inherit',
    backgroundColor: overlay.type === 'text' ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
    color: overlay.type === 'text' ? 'white' : 'inherit',
    border: isDragging || isResizing ? '2px dashed #007bff' : '1px solid rgba(255, 255, 255, 0.3)',
  };

  return (
    <Draggable
      position={{ x: overlay.position.x, y: overlay.position.y }}
      onStart={handleDragStart}
      onStop={handleDragStop}
      disabled={isEditing || isResizing}
    >
      <div
        ref={overlayRef}
        className={`overlay ${overlay.type} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
        style={overlayStyle}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <div className="edit-mode">
            {overlay.type === 'text' ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="edit-input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleEditSubmit();
                  } else if (e.key === 'Escape') {
                    handleEditCancel();
                  }
                }}
              />
            ) : (
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="edit-input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEditSubmit();
                  } else if (e.key === 'Escape') {
                    handleEditCancel();
                  }
                }}
              />
            )}
            <div className="edit-buttons">
              <button onClick={handleEditSubmit} className="save-btn">Save</button>
              <button onClick={handleEditCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="overlay-content">
              {overlay.type === 'text' ? (
                <span>{overlay.content}</span>
              ) : (
                <img 
                  src={overlay.content} 
                  alt="Overlay" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              )}
              {overlay.type === 'image' && (
                <div className="image-error" style={{ display: 'none' }}>
                  Image not found
                </div>
              )}
            </div>
            
            {/* Resize handle */}
            <div className="resize-handle"></div>
            
            {/* Overlay info tooltip */}
            <div className="overlay-tooltip">
              <small>
                {overlay.type} | {overlay.position.x},{overlay.position.y} | 
                {overlay.size.width}x{overlay.size.height}
              </small>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
};

export default Overlay;
