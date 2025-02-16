'''
User will provide image (JPEG/possibly other file formats) and
convert it to a simplified image which kinda looks like a constellation.

This simplified image will be used to compare to all satellite images,
and the closest looking constellation will be found.
'''

import cv2
import numpy as np
import os

# image_path = "@my-app/public/user-input/constellation.jpg"
# Correct the path to reference the public/user-input folder
image_path = os.path.join(os.path.dirname(__file__), "../public/user-input/userImage.png")
image_path = os.path.normpath(image_path)  # Normalize for cross-platform compatibility
desired_points = 10

# Check if the image exists
if not os.path.exists(image_path):
    print("Image not found. Make sure it was saved correctly.")
    exit()

def segment_img(image_path, desired_points):
    '''
    Simplify image into "desired_points" amount of lines, 
    combining all contours into one approximation.
    '''
    # Load the image
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Canny edge detection
    edges = cv2.Canny(gray, 50, 150)

    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Validate contours
    if not contours:
        raise ValueError("No contours found in the image.")
    
    # Convert all contours to numpy arrays with correct format
    contours = [np.array(c, dtype=np.int32).reshape(-1, 1, 2) for c in contours]

    # Combine all contours into one large array
    all_points = np.vstack([c for c in contours if len(c) > 0])

    # Simplify the combined contour to the desired number of points
    approx_points = calculate_epsilon_for_points(all_points, desired_points)

    # Create a blank image to draw the contours
    output = np.zeros_like(image)

    # Draw the simplified combined contour
    cv2.drawContours(output, [approx_points.astype(int)], -1, (0, 0, 255), 2)  # Red for approximation

    cv2.imwrite(f"public/processed-user-input/processed_user_img.png", output)

    return output

def calculate_epsilon_for_points(contour, target_points, initial_epsilon=0.01, max_iterations=1000):
    """Find the epsilon value using binary search to reach the target number of approximation points."""
    
    # Define search range
    low, high = 0.0001, 100000.0
    epsilon = initial_epsilon

    for _ in range(max_iterations):
        # Approximate contour with current epsilon
        approx = cv2.approxPolyDP(contour, epsilon, True)
        current_points = len(approx)

        # DEBUG STATEMENT ------------------------------------------------
        #print(f"Current points: {current_points}, Epsilon: {epsilon}")
        # END OF DEBUG STATEMENT -------------------------------------------

        if current_points == target_points:
            break

        # Narrow the search range based on the number of points
        if current_points > target_points:
            low = epsilon
        else:
            high = epsilon

        # Recalculate epsilon using binary search
        epsilon = (low + high) / 2
        # Ensure epsilon is always positive
        epsilon = max(epsilon, 0.0001)

    print(f"Final Epsilon: {epsilon}, Final Number of Points: {len(approx)}")
    return approx

segment_img(image_path, desired_points)