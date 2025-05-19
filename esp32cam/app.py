from flask import Flask, request, jsonify, render_template
import cloudinary
import cloudinary.uploader
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
import requests
from PIL import Image
import io
import base64
import config

# Initialize Flask app
app = Flask(__name__)

# Configure Cloudinary
if config.CLOUDINARY_URL and config.CLOUDINARY_URL.startswith('cloudinary://'):
    # Use environment variable if available
    cloudinary.config(cloudinary_url=config.CLOUDINARY_URL)
else:
    # Use explicit configuration
    cloudinary.config(**config.CLOUDINARY_CONFIG)

# Initialize Firebase
try:
    # Try to initialize with service account key file
    if os.path.exists(config.FIREBASE_SERVICE_ACCOUNT_KEY_PATH):
        cred = credentials.Certificate(config.FIREBASE_SERVICE_ACCOUNT_KEY_PATH)
        firebase_admin.initialize_app(cred)
    elif config.GOOGLE_APPLICATION_CREDENTIALS:
        # Use environment variable
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = config.GOOGLE_APPLICATION_CREDENTIALS
        firebase_admin.initialize_app()
    else:
        # Try default initialization
        firebase_admin.initialize_app()
        
    db = firestore.client()
    print("✅ Firebase initialized successfully")
except Exception as e:
    print(f"❌ Firebase initialization failed: {str(e)}")
    print("Please check your Firebase configuration")
    db = None

def upload_to_cloudinary(image_data, source_type="esp32", filename=None):
    """Upload image to Cloudinary and return the URL"""
    try:
        if filename is None:
            filename = f"{source_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            image_data,
            public_id=filename,
            folder=f"{config.UPLOAD_SETTINGS['cloudinary_folder']}/{source_type}",
            resource_type="image"
        )
        
        print(f"✅ Image uploaded to Cloudinary: {result['secure_url']}")
        return result['secure_url'], result['public_id']
    except Exception as e:
        print(f"❌ Error uploading to Cloudinary: {str(e)}")
        return None, None

def save_to_firebase(image_url, public_id, source_type, metadata=None):
    """Save image URL and metadata to Firebase Firestore"""
    if db is None:
        print("❌ Firebase not initialized, skipping database save")
        return None
        
    try:
        doc_data = {
            'image_url': image_url,
            'public_id': public_id,
            'source_type': source_type,
            'timestamp': datetime.now(),
            'metadata': metadata or {}
        }
        
        # Add to Firebase collection
        doc_ref = db.collection(config.FIREBASE_COLLECTION_NAME).add(doc_data)
        print(f"✅ Image metadata saved to Firebase: {doc_ref[1].id}")
        return doc_ref[1].id
    except Exception as e:
        print(f"❌ Error saving to Firebase: {str(e)}")
        return None

@app.route('/')
def index():
    """Main page with image upload and viewing interface"""
    return render_template('index.html')

@app.route('/upload_image', methods=['POST'])
def upload_image():
    """Handle image upload from ESP32-CAM"""
    try:
        print(f"📸 Received image upload request from {request.remote_addr}")
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read image data
        image_data = file.read()
        print(f"📏 Image size: {len(image_data)} bytes")
        
        # Validate file size
        if len(image_data) > config.UPLOAD_SETTINGS['max_file_size']:
            return jsonify({'error': 'File too large'}), 400
        
        # Upload to Cloudinary
        image_url, public_id = upload_to_cloudinary(image_data, "esp32")
        
        if image_url:
            # Save to Firebase
            metadata = {
                'file_size': len(image_data),
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent', '')
            }
            doc_id = save_to_firebase(image_url, public_id, "esp32", metadata)
            
            response_data = {
                'success': True,
                'message': 'Image uploaded successfully',
                'image_url': image_url,
                'public_id': public_id
            }
            
            if doc_id:
                response_data['firebase_doc_id'] = doc_id
                print(f"✅ ESP32 image processed successfully: {image_url}")
                return jsonify(response_data), 200
            else:
                print(f"⚠️ Image uploaded to Cloudinary but failed to save to Firebase")
                response_data['message'] = 'Image uploaded to Cloudinary but failed to save to Firebase'
                return jsonify(response_data), 207  # Partial success
        else:
            print(f"❌ Failed to upload ESP32 image to Cloudinary")
            return jsonify({
                'success': False,
                'message': 'Failed to upload image to Cloudinary'
            }), 500
            
    except Exception as e:
        print(f"❌ Error processing ESP32 image: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error processing image: {str(e)}'
        }), 500

@app.route('/upload_random_images', methods=['POST'])
def upload_random_images():
    """Upload 3 random test images to Cloudinary"""
    try:
        # Create 3 sample images using PIL
        uploaded_images = []
        
        for i in range(3):
            # Create a sample image
            img = Image.new('RGB', (640, 480), color=(
                (i * 80) % 255,
                (i * 120) % 255,
                (i * 160) % 255
            ))
            
            # Add some text to the image
            from PIL import ImageDraw, ImageFont
            draw = ImageDraw.Draw(img)
            try:
                # Try to use a default font
                font = ImageFont.load_default()
            except:
                font = None
            
            text = f"Test Image {i + 1}\n{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            draw.text((50, 200), text, fill=(255, 255, 255), font=font)
            
            # Convert PIL image to bytes
            img_buffer = io.BytesIO()
            img.save(img_buffer, format='JPEG')
            img_buffer.seek(0)
            
            # Upload to Cloudinary
            image_url, public_id = upload_to_cloudinary(
                img_buffer.getvalue(),
                "random",
                f"test_image_{i + 1}"
            )
            
            if image_url:
                # Save to Firebase
                metadata = {
                    'test_number': i + 1,
                    'description': f'Random test image {i + 1}'
                }
                doc_id = save_to_firebase(image_url, public_id, "random", metadata)
                
                uploaded_images.append({
                    'image_url': image_url,
                    'public_id': public_id,
                    'firebase_doc_id': doc_id
                })
        
        return jsonify({
            'success': True,
            'message': f'Successfully uploaded {len(uploaded_images)} random images',
            'images': uploaded_images
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error uploading random images: {str(e)}'
        }), 500

@app.route('/get_images')
def get_images():
    """Get all images from Firebase"""
    if db is None:
        return jsonify({
            'success': False,
            'message': 'Firebase not initialized'
        }), 500
        
    try:
        source_type = request.args.get('source_type', 'all')
        limit = int(request.args.get('limit', config.UPLOAD_SETTINGS['default_image_limit']))
        
        # Query Firebase
        images_ref = db.collection(config.FIREBASE_COLLECTION_NAME)
        
        if source_type != 'all':
            images_ref = images_ref.where('source_type', '==', source_type)
        
        images_ref = images_ref.order_by('timestamp', direction=firestore.Query.DESCENDING).limit(limit)
        
        images = []
        for doc in images_ref.stream():
            image_data = doc.to_dict()
            image_data['id'] = doc.id
            # Convert timestamp to string for JSON serialization
            if 'timestamp' in image_data:
                image_data['timestamp'] = image_data['timestamp'].isoformat()
            images.append(image_data)
        
        print(f"📋 Retrieved {len(images)} images (filter: {source_type})")
        return jsonify({
            'success': True,
            'images': images,
            'count': len(images)
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching images: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error fetching images: {str(e)}'
        }), 500

@app.route('/delete_image/<image_id>', methods=['DELETE'])
def delete_image(image_id):
    """Delete an image from both Cloudinary and Firebase"""
    if db is None:
        return jsonify({
            'success': False,
            'message': 'Firebase not initialized'
        }), 500
        
    try:
        # Get image data from Firebase first
        doc_ref = db.collection(config.FIREBASE_COLLECTION_NAME).document(image_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return jsonify({
                'success': False,
                'message': 'Image not found in database'
            }), 404
        
        image_data = doc.to_dict()
        public_id = image_data.get('public_id')
        
        # Delete from Cloudinary
        if public_id:
            try:
                cloudinary.uploader.destroy(public_id)
                print(f"🗑️ Deleted from Cloudinary: {public_id}")
            except Exception as e:
                print(f"⚠️ Error deleting from Cloudinary: {str(e)}")
        
        # Delete from Firebase
        doc_ref.delete()
        print(f"🗑️ Deleted from Firebase: {image_id}")
        
        return jsonify({
            'success': True,
            'message': 'Image deleted successfully'
        }), 200
        
    except Exception as e:
        print(f"❌ Error deleting image: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error deleting image: {str(e)}'
        }), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    services = {
        'cloudinary': 'connected',
        'firebase': 'connected' if db is not None else 'disconnected'
    }
    
    # Test Cloudinary connection
    try:
        cloudinary.api.ping()
    except:
        services['cloudinary'] = 'disconnected'
    
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'services': services,
        'version': '1.0.0'
    }), 200

if __name__ == '__main__':
    print("🚀 Starting ESP32-CAM Image Management Server")
    print(f"📡 Server will run on {config.FLASK_HOST}:{config.FLASK_PORT}")
    print(f"☁️ Cloudinary: {'✅ Configured' if config.CLOUDINARY_CONFIG else '❌ Not configured'}")
    print(f"🔥 Firebase: {'✅ Connected' if db else '❌ Not connected'}")
    print(f"🌐 Web interface: http://localhost:{config.FLASK_PORT}")
    print("-" * 50)
    
    app.run(
        host=config.FLASK_HOST, 
        port=config.FLASK_PORT, 
        debug=config.FLASK_DEBUG
    )