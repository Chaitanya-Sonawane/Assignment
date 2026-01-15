from pymongo import MongoClient
from bson import ObjectId
from config import Config
import logging
from datetime import datetime

class Database:
    _instance = None
    _client = None
    _db = None
    _connected = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
        return cls._instance
    
    def connect(self):
        try:
            self._client = MongoClient(Config.MONGODB_URI, serverSelectionTimeoutMS=5000)
            self._db = self._client[Config.DATABASE_NAME]
            # Test connection
            self._client.admin.command('ping')
            self._connected = True
            logging.info("Connected to MongoDB successfully")
        except Exception as e:
            logging.error(f"Failed to connect to MongoDB: {e}")
            logging.warning("Application will continue with in-memory storage (data will not persist)")
            self._client = None
            self._db = None
            self._connected = False
    
    def get_collection(self):
        if self._db is None and not self._connected:
            self.connect()
        return self._db[Config.COLLECTION_NAME] if self._db is not None else None
    
    def is_connected(self):
        return self._connected

class Overlay:
    def __init__(self):
        self.db = Database()
        self.collection = self.db.get_collection()
        # In-memory storage for when MongoDB is not available
        self._memory_store = {}
        self._next_id = 1
    
    def _generate_id(self):
        """Generate a fake ObjectId for in-memory storage"""
        id_str = f"{self._next_id:024d}"
        self._next_id += 1
        return id_str
    
    def create(self, overlay_data):
        """Create a new overlay"""
        try:
            if self.collection is not None:
                # Use MongoDB
                result = self.collection.insert_one(overlay_data)
                return str(result.inserted_id)
            else:
                # Use in-memory storage
                overlay_id = self._generate_id()
                self._memory_store[overlay_id] = {**overlay_data, '_id': overlay_id}
                logging.info(f"Created overlay in memory: {overlay_id}")
                return overlay_id
        except Exception as e:
            logging.error(f"Error creating overlay: {e}")
            raise
    
    def get_all(self):
        """Get all overlays"""
        try:
            if self.collection is not None:
                # Use MongoDB
                overlays = list(self.collection.find())
                for overlay in overlays:
                    overlay['_id'] = str(overlay['_id'])
                return overlays
            else:
                # Use in-memory storage
                return list(self._memory_store.values())
        except Exception as e:
            logging.error(f"Error fetching overlays: {e}")
            raise
    
    def get_by_id(self, overlay_id):
        """Get overlay by ID"""
        try:
            if self.collection is not None:
                # Use MongoDB
                overlay = self.collection.find_one({'_id': ObjectId(overlay_id)})
                if overlay:
                    overlay['_id'] = str(overlay['_id'])
                return overlay
            else:
                # Use in-memory storage
                return self._memory_store.get(overlay_id)
        except Exception as e:
            logging.error(f"Error fetching overlay by ID: {e}")
            raise
    
    def update(self, overlay_id, update_data):
        """Update overlay by ID"""
        try:
            if self.collection is not None:
                # Use MongoDB
                result = self.collection.update_one(
                    {'_id': ObjectId(overlay_id)},
                    {'$set': update_data}
                )
                return result.modified_count > 0
            else:
                # Use in-memory storage
                if overlay_id in self._memory_store:
                    self._memory_store[overlay_id].update(update_data)
                    logging.info(f"Updated overlay in memory: {overlay_id}")
                    return True
                return False
        except Exception as e:
            logging.error(f"Error updating overlay: {e}")
            raise
    
    def delete(self, overlay_id):
        """Delete overlay by ID"""
        try:
            if self.collection is not None:
                # Use MongoDB
                result = self.collection.delete_one({'_id': ObjectId(overlay_id)})
                return result.deleted_count > 0
            else:
                # Use in-memory storage
                if overlay_id in self._memory_store:
                    del self._memory_store[overlay_id]
                    logging.info(f"Deleted overlay from memory: {overlay_id}")
                    return True
                return False
        except Exception as e:
            logging.error(f"Error deleting overlay: {e}")
            raise
