from flask import Flask, request, send_file, jsonify
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def compress_image(input_image, level):
    img = Image.open(input_image)
    output_io = io.BytesIO()

    if level == 'low':
        quality = 85
    elif level == 'medium':
        quality = 65
    elif level == 'high':
        quality = 35

    img.save(output_io, format='JPEG', optimize=True, quality=quality)
    output_io.seek(0)

    return output_io

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    compression_level = request.form.get('level')

    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    filename = file.filename
    file_extension = filename.split('.')[-1].lower()

    if file_extension in ['jpg', 'jpeg', 'png']:
        compressed_file = compress_image(file, compression_level)
        file_type = 'image/jpeg'
    else:
        return jsonify({'error': 'Unsupported file type'}), 400

    return send_file(
        compressed_file,
        mimetype=file_type,
        as_attachment=True,
        download_name=filename  
    )

if __name__ == '__main__':
    app.run(debug=True)