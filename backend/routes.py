from flask import Blueprint, request, jsonify
from models import Overlay
from bson import ObjectId
import logging

api = Blueprint('api', __name__)
overlay_model = Overlay()

def validate_overlay_data(data, is_update=False):
    """Validate overlay data"""
    errors = []
    
    if not is_update or 'type' in data:
        if 'type' not in data or data['type'] not in ['text', 'image']:
            errors.append("Type must be 'text' or 'image'")
    
    if not is_update or 'content' in data:
        if 'content' not in data or not isinstance(data['content'], str) or not data['content'].strip():
            errors.append("Content must be a non-empty string")
    
    if not is_update or 'position' in data:
        if 'position' not in data or not isinstance(data['position'], dict):
            errors.append("Position must be an object")
        else:
            pos = data['position']
            if 'x' not in pos or 'y' not in pos:
                errors.append("Position must have x and y coordinates")
            elif not isinstance(pos['x'], (int, float)) or not isinstance(pos['y'], (int, float)):
                errors.append("Position coordinates must be numbers")
    
    if not is_update or 'size' in data:
        if 'size' not in data or not isinstance(data['size'], dict):
            errors.append("Size must be an object")
        else:
            size = data['size']
            if 'width' not in size or 'height' not in size:
                errors.append("Size must have width and height")
            elif not isinstance(size['width'], (int, float)) or not isinstance(size['height'], (int, float)):
                errors.append("Size dimensions must be numbers")
            elif size['width'] <= 0 or size['height'] <= 0:
                errors.append("Size dimensions must be positive numbers")
    
    return errors

@api.route('/overlays', methods=['POST'])
def create_overlay():
    """Create a new overlay"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate data
        errors = validate_overlay_data(data)
        if errors:
            return jsonify({'errors': errors}), 400
        
        # Create overlay
        overlay_id = overlay_model.create(data)
        
        return jsonify({
            'message': 'Overlay created successfully',
            'id': overlay_id
        }), 201
        
    except Exception as e:
        logging.error(f"Error in create_overlay: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/overlays', methods=['GET'])
def get_all_overlays():
    """Get all overlays"""
    try:
        overlays = overlay_model.get_all()
        return jsonify({'overlays': overlays}), 200
        
    except Exception as e:
        logging.error(f"Error in get_all_overlays: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/overlays/<overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    """Get single overlay by ID"""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(overlay_id):
            return jsonify({'error': 'Invalid overlay ID format'}), 400
        
        overlay = overlay_model.get_by_id(overlay_id)
        
        if not overlay:
            return jsonify({'error': 'Overlay not found'}), 404
        
        return jsonify({'overlay': overlay}), 200
        
    except Exception as e:
        logging.error(f"Error in get_overlay: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    """Update overlay by ID"""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(overlay_id):
            return jsonify({'error': 'Invalid overlay ID format'}), 400
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Log the incoming data for debugging
        logging.info(f"Update request for {overlay_id}: {data}")
        
        # Validate data
        errors = validate_overlay_data(data, is_update=True)
        if errors:
            logging.error(f"Validation errors: {errors}")
            return jsonify({'errors': errors}), 400
        
        # Check if overlay exists
        existing_overlay = overlay_model.get_by_id(overlay_id)
        if not existing_overlay:
            return jsonify({'error': 'Overlay not found'}), 404
        
        # Update overlay
        success = overlay_model.update(overlay_id, data)
        
        if success:
            return jsonify({'message': 'Overlay updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update overlay'}), 500
        
    except Exception as e:
        logging.error(f"Error in update_overlay: {e}", exc_info=True)
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@api.route('/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    """Delete overlay by ID"""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(overlay_id):
            return jsonify({'error': 'Invalid overlay ID format'}), 400
        
        # Check if overlay exists
        existing_overlay = overlay_model.get_by_id(overlay_id)
        if not existing_overlay:
            return jsonify({'error': 'Overlay not found'}), 404
        
        # Delete overlay
        success = overlay_model.delete(overlay_id)
        
        if success:
            return jsonify({'message': 'Overlay deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete overlay'}), 500
        
    except Exception as e:
        logging.error(f"Error in delete_overlay: {e}")
        return jsonify({'error': 'Internal server error'}), 500
