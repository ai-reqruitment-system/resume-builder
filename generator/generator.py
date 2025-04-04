from flask import Flask, request, jsonify, send_from_directory
import pdfkit
import os
import traceback
from uuid import uuid4

app = Flask(__name__)

PDF_DIR = 'generated_pdfs'
os.makedirs(PDF_DIR, exist_ok=True)

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    pdf_filename = f"{uuid4()}.pdf"
    pdf_path = os.path.join(PDF_DIR, pdf_filename)

    try:
        pdfkit.from_url(url, pdf_path)
        pdf_url = request.host_url + 'pdf/' + pdf_filename
        return jsonify({'pdf_url': pdf_url}), 200
    except Exception as e:
        error_details = {
            'error': str(e),
            'traceback': traceback.format_exc()
        }
        return jsonify(error_details), 500

@app.route('/pdf/<filename>', methods=['GET'])
def get_pdf(filename):
    return send_from_directory(PDF_DIR, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6005, debug=True)