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
import requests

from supabase import create_client, Client


# Replace with your actual Supabase project URL and service role key
SUPABASE_URL = "https://frukqmrecrlqojwkcwob.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydWtxbXJlY3JscW9qd2tjd29iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc1MTE3NiwiZXhwIjoyMDU1MzI3MTc2fQ.Qhob4_nTXIWVpiVmBbKU4r9cakD35tNcOIkp5AHHc_U"  # Use SERVICE ROLE KEY for writes

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# Load the MultiModal Universe JWST Dataset
dataset = load_dataset("MultimodalUniverse/legacysurvey", split="train", streaming=True)

# Directory to save processed images
output_dir = "processed_images"
os.makedirs(output_dir, exist_ok=True)

# Define constant values
TRUE_BLACK = (0,0,0)



# Process the images
i = 2530
for i, data in enumerate(dataset):
    if i <= 2530:
        continue
    elif i >= 10000:  # Process only the first image for demonstration
        break

    # Check if 'blobmodel' exists in the data
    if 'blobmodel' in data and data['blobmodel'] is not None:
        # 'blobmodel' is a PIL Image object
        blobmodel_image = data['blobmodel']

        # Save the original blobmodel image as a PNG file
        output_path = os.path.join(output_dir, f"blobmodel_image_{i}.png")
        blobmodel_image.save(output_path, format="PNG")

        # print(f"Blobmodel image {i} saved as {output_path}.")

        # Convert PIL image to NumPy array for further processing
        img = np.array(blobmodel_image)

        # Convert image to grayscale
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Identify the bright points & create a mask for them
        _, thresh_img = cv2.threshold(gray_img, 50, 255, cv2.THRESH_BINARY)

        # Find contours of the bright spots
        contours, _ = cv2.findContours(thresh_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Create a copy of the original image to draw on
        processed_img = img.copy()

        # Define the size of the uniform square (3x3 pixels)
        square_size = 1
        half_size = square_size // 2

        # Loop over each contour
        for contour in contours:
            # Calculate the moments of the contour to find the centroid
            M = cv2.moments(contour)
            if M["m00"] != 0:
                cX = int(M["m10"] / M["m00"])
                cY = int(M["m01"] / M["m00"])

                # Define the top-left corner of the 1x1 square
                startX = cX - half_size
                startY = cY - half_size

                # Ensure the square is within image boundaries
                if startX >= 0 and startY >= 0 and (startX + square_size) <= img.shape[1] and (startY + square_size) <= img.shape[0]:
                    # Draw the 1x1 square with white color (255, 255, 255)
                    processed_img[startY:startY + square_size, startX:startX + square_size] = (255, 255, 255)

                # Check if the coordinate already exists
                existing_entry = (
                    supabase.table("coordinates")
                    .select("index")
                    .eq("index", i)
                    .eq("coord-x", startX)
                    .eq("coord-y", startY)
                    .execute()
                )

                # Data payload
                data = {
                    "index" : i,
                    "coord-x" : startX,
                    "coord-y" : startY
                }

                if not existing_entry.data:  # If no existing entry, insert
                    response = supabase.table("coordinates").insert(data).execute()
                # else:
                #     print(f"⚠️ Duplicate entry skipped: {data}")
        
        # Remove 'blobmodel' img
        if os.path.exists(output_path):
            os.remove(output_path)

        # convert img to grayscale
        gray_img2 = cv2.cvtColor(processed_img, cv2.COLOR_BGR2GRAY)

        # identify the bright points & create a mask for them
        _, thresh_img2 = cv2.threshold(gray_img2, 250, 255, cv2.THRESH_BINARY)
        bright_points_mask2 = thresh_img2 == 255

        # apply TRUE_BLACK to darker (unmasked) pixels
        processed_img[~bright_points_mask2] = TRUE_BLACK

        print(f'{i}')
