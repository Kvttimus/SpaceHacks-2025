'''
1. Get User Input for img
2. Process the user input img to identify the main points in the img (these will be matched to stars)
3. Find the img with stars that most closely resemble the vertices identified in step 2
4. Turn that img cartoony-ish & save in a global variable
-

take satellite img & convert it to dots
- take the img
- identify the darker colors & turn it into a uniform "true black"
- take the brightest pixels 
        - take the center of that group & make the pixel lighter
        - insert it into the new list
convert the user input into dots
match them and see which img in the dataset has the most amount of collisions
'''

from datasets import load_dataset
from PIL import Image
import numpy as np
import cv2
import io
import os

# Load the MultiModal Universe JWST Dataset
dataset = load_dataset("MultimodalUniverse/legacysurvey", split="train", streaming=True)

# Directory to save processed images
output_dir = "processed_images"
os.makedirs(output_dir, exist_ok=True)

processed_imgs = []

# Define constant values
TRUE_BLACK = (0,0,0)
BRIGHTNESS_INCREASE = 75
SATURATION_SCALE = 10

# Process the images
for i, data in enumerate(dataset):
    if i >= 1:  # Process only the first image for demonstration
        break

    # Check if 'blobmodel' exists in the data
    if 'blobmodel' in data and data['blobmodel'] is not None:
        # 'blobmodel' is a PIL Image object
        blobmodel_image = data['blobmodel']

        # Save the original blobmodel image as a PNG file
        output_path = os.path.join(output_dir, f"blobmodel_image_{i}.png")
        blobmodel_image.save(output_path, format="PNG")

        print(f"Blobmodel image {i} saved as {output_path}.")

        # Convert PIL image to NumPy array for further processing
        img = np.array(blobmodel_image)

        # convert img to grayscale
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # identify the bright points & create a mask for them
        _, thresh_img = cv2.threshold(gray_img, 50, 255, cv2.THRESH_BINARY)
        bright_points_mask = thresh_img == 255

        # apply TRUE_BLACK to darker (unmasked) pixels
        img[~bright_points_mask] = TRUE_BLACK

        hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        h,s,v = cv2.split(hsv_img)

        s = s.astype(np.float32)
        s *= SATURATION_SCALE

        s = np.clip(s, 0, 255)
        s = s.astype(np.uint8)

        hsv_img = cv2.merge([h,s,v])
        enhanced_img = cv2.cvtColor(hsv_img, cv2.COLOR_HSV2BGR)
        
        # increase brightness of remaining points
        enhanced_img[bright_points_mask] = cv2.add(enhanced_img[bright_points_mask], BRIGHTNESS_INCREASE)
        enhanced_img = np.clip(enhanced_img, 0, 255)  # ensured pixel values remain valid

        # Save the processed image as a PNG file
        processed_output_path = os.path.join(output_dir, f"processed_image_{i}.png")
        #cv2.imwrite(processed_output_path, enhanced_img)
        cv2.imwrite(processed_output_path, img)

        #processed_imgs.append(enhanced_img)
        processed_imgs.append(img)

        # Remove 'blobmodel' img
        if os.path.exists(output_path):
            os.remove(output_path)

        print(f"Processed image {i} saved as {processed_output_path}.")
    else:
        print(f"No blobmodel available for entry {i}")





