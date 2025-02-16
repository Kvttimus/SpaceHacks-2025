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
from PIL import Image as Image
import cv2
import numpy as np
import io


# Load in the MultiModal Universe JWST Dataset
dataset = load_dataset("MultimodalUniverse/legacysurvey", split="train", streaming=True)

# dataset = dataset.cast_column("image", Image(decode=True))

# Define constant values
TRUE_BLACK = (0,0,0)
BRIGHTNESS_INCREASE = 75
SATURATION_SCALE = 10

# Process the imgs & convert them to cartoonish versions
processed_imgs = []


for i, data in enumerate(dataset):
    if i >= 1:
        break

    # TEST CODE -----------------------------------------
    img_path = "GalaxyTest IMG.jpg"
    img = cv2.imread(img_path)
    # END OF TEST CODE 

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

    # store the processed img
    processed_imgs.append(enhanced_img)

    # DEBUG STATEMENT ----------------------------------------------------------
    cv2.imwrite(f"processed_img_{i}.png", img)