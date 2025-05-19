import os

# Flask Configuration
FLASK_HOST = '0.0.0.0'
FLASK_PORT = 5000
FLASK_DEBUG = True

# Cloudinary Configuration
CLOUDINARY_CONFIG = {
    'cloud_name': 'doexsalsr',
    'api_key': '163721262163362',
    'api_secret': 'gvkEIYpQ2jDev_DLh3oT9uIIPPs'
}

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY_PATH = 'firebase-service-account-key.json'
FIREBASE_COLLECTION_NAME = 'images'

# Upload Settings
UPLOAD_SETTINGS = {
    'max_file_size': 16 * 1024 * 1024,  # 16MB
    'allowed_extensions': {'jpg', 'jpeg', 'png', 'gif', 'bmp'},
    'cloudinary_folder': 'esp32_images',
    'jpeg_quality': 85,  # For random test images
    'max_images_per_request': 10,
    'default_image_limit': 50
}

# ESP32-CAM Settings
ESP32_SETTINGS = {
    'expected_content_type': 'image/jpeg',
    'max_retries': 3,
    'timeout_seconds': 30
}

# UI Settings
UI_SETTINGS = {
    'auto_refresh_interval': 30000,  # milliseconds
    'images_per_page': 50,
    'thumbnail_size': (300, 200),
    'enable_delete_all': True,
    'enable_manual_upload': True,
    'enable_random_images': True
}

# Environment Variables (override config if set)
CLOUDINARY_URL = os.getenv('CLOUDINARY_URL')
GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# Security Settings (for production)
SECURITY_SETTINGS = {
    'enable_cors': False,
    'require_auth': False,
    'api_key_required': False,
    'max_requests_per_minute': 60,
    'enable_rate_limiting': False
}