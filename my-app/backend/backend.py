# '''
# - log received requests and catch errors
# '''

# from flask import Flask, request, jsonify
# import base64
# from PIL import Image
# import io

# app = Flask(__name__)

# @app.route('/process-image', methods=['POST'])
# def process_image():
#     try:
#         print("Received request")

#         data = request.json
#         if 'image' not in data:
#             print("Error: No 'image' key in request")
#             return jsonify({"error": "No image provided"}), 400

#         # Decode the base64 image
#         image_data = data['image'].split(',')[1]  # Remove the "data:image/png;base64," prefix
#         image = Image.open(io.BytesIO(base64.b64decode(image_data)))

#         print("Image successfully received and decoded")

#         # TODO: Perform image processing here
#         image.save("processed_output.png")  # Save the processed image for debugging

#         return jsonify({"message": "Image processed successfully!"})
#     except Exception as e:
#         print(f"Server Error: {str(e)}")  # Log full error
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=3001, debug=True)
