from datasets import load_dataset
from PIL import Image
from simplify_user_img import find_best_star
import numpy as np
import cv2
import io
import os
import requests


# Load the MultiModal Universe JWST Dataset
dataset = load_dataset("MultimodalUniverse/legacysurvey", split="train", streaming=True)

# Directory to save processed img
output_dir = "processed_images"
os.makedirs(output_dir, exist_ok=True)

# Defining the location to get the user input from
image_path = os.path.join(os.path.dirname(__file__), "../public/user-input/userImage.png")
image_path = os.path.normpath(image_path)  # Normalize for cross-platform compatibility

# Defining output path
simplified_image_path = os.path.join(os.path.dirname(__file__), "../public/processed-user-input/simplified_star.png")
simplified_image_path = os.path.normpath(simplified_image_path)

# Define constant values
TRUE_BLACK = (0,0,0)
BRIGHTNESS_INCREASE = 75
SATURATION_SCALE = 10


# Finding the index of the best star
target_index = find_best_star(image_path)
# print("TYPE: ", type(target_index))
print(f"Best Image: {target_index}")
for i, data in enumerate(dataset):
    print(f"{i}")
    # print(f"TYPE: ", type(i))
    if i == target_index:
        print("PROCESSED IMAGE ---------------------------------------------------------")
        # # Check if 'blobmodel' exists in the data
        if 'blobmodel' in data and data['blobmodel'] is not None:
            # 'blobmodel' is a PIL Image object
            blobmodel_image = data['blobmodel']

            # Save the original blobmodel image as a PNG file
            output_path = os.path.join(output_dir, f"blobmodel_image_{i}.png")
            blobmodel_image.save(output_path, format="PNG")

            # Convert PIL image to NumPy array for further processing
            img = np.array(blobmodel_image)

            # convert img to grayscale
            gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # identify the bright points & create a mask for them
            _, thresh_img = cv2.threshold(gray_img, 50, 255, cv2.THRESH_BINARY)
            bright_points_mask = thresh_img == 255

            # apply TRUE_BLACK to darker (unmasked) pixels
            img[~bright_points_mask] = TRUE_BLACK

            # # increase brightness of remaining points
            # img[bright_points_mask] = cv2.add(img[bright_points_mask], BRIGHTNESS_INCREASE)
            # img = np.clip(img, 0, 255)  # ensured pixel values remain valid

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

            # Save the processed image
            # cv2.imwrite(simplified_image_path, enhanced_img)
            # cv2.imwrite(f"public/processed-user-input/star_img.png", img)
            cv2.imwrite(f"public/processed-user-input/star_img.png", enhanced_img)

    
    elif i > target_index:
        break
    else:
        continue