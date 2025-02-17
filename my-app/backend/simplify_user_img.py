'''
User will provide image (JPEG/possibly other file formats) and
convert it to a simplified image which kinda looks like a constellation.

This simplified image will be used to compare to all satellite images,
and the closest looking constellation will be found.
'''

import cv2
import numpy as np
import math
import os
import random

from supabase import create_client, Client

# image_path = "@my-app/public/user-input/constellation.jpg"
# Correct the path to reference the public/user-input folder
image_path = os.path.join(os.path.dirname(__file__), "../public/user-input/userImage.png")
image_path = os.path.normpath(image_path)  # Normalize for cross-platform compatibility
desired_points = 10

simplified_image_path = os.path.join(os.path.dirname(__file__), "../public/processed-user-input/processed_user_img.png")
simplified_image_path = os.path.normpath(simplified_image_path)

# Replace with your actual Supabase project URL and service role key
SUPABASE_URL = "https://frukqmrecrlqojwkcwob.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydWtxbXJlY3JscW9qd2tjd29iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc1MTE3NiwiZXhwIjoyMDU1MzI3MTc2fQ.Qhob4_nTXIWVpiVmBbKU4r9cakD35tNcOIkp5AHHc_U"  # Use SERVICE ROLE KEY for writes

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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

    # Make approx points in right dimension
    return output, approx_points

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

        if current_points == target_points or low == high:
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

# Segment the image to get the coordinates of the user's drawing
def get_coords_from_drawing(image_path, desired_points):
    _, orig_points = segment_img(image_path, desired_points)
    return orig_points.reshape(-1, 2)

# Compare user generated image to star image
def compare_img(orig_coords, star_coords):
    """
    Compare the user's drawing (original image) to the star constellation.

    Parameters:
        orig_image_path (str): Path to the user's drawing image.
        star_coords (tuple): A tuple of (x, y) coordinates representing the star constellation.

    Returns:
        float: A similarity score (lower means more similar).
    """

    # If both structures are empty, they are identical
    if len(orig_coords) == 0 and len(star_coords) == 0:
        return 0.0
    
    def euclidean_distance(p, q):
        """Compute the Euclidean distance between two points."""
        return math.hypot(p[0] - q[0], p[1] - q[1])
    
    # Handle cases where one structure is empty
    if len(orig_coords) == 0 or len(star_coords) == 0:
        return float('inf')  # Completely dissimilar if one is empty
    
    # Chamfer distance calculation
    dist_1_to_2 = sum(min(euclidean_distance(p1, p2) for p2 in star_coords) for p1 in orig_coords)
    dist_2_to_1 = sum(min(euclidean_distance(p2, p1) for p1 in orig_coords) for p2 in star_coords)
    
    # Normalize the score
    total_points = len(orig_coords) + len(star_coords)
    score = (dist_1_to_2 + dist_2_to_1) / total_points
    
    return score

# Get coordinates of all stars in a star image
def get_coordinates_by_index(index_value, table_name="coordinates"):
    """Fetch all (x, y) coordinates for a given index."""
    response = supabase.table(table_name).select("coord-x, coord-y").eq("index", index_value).execute()
    
    if response.data:
        coords = [(row["coord-x"], row["coord-y"]) for row in response.data]
        return coords
    else:
        return []

def find_best_star(usr_image_path):
    """
    Given a path to the user's image, find the star index in the Supabase database
    that most closely resembles the user's drawing.
    
    For each star image, the user's drawing is simplified into the same number
    of points as the star image. These simplified coordinates are cached for reuse.
    
    Returns:
        (best_index, best_score) if found, otherwise (None, None).
    """
    
    # Cache to store user coordinates for a given number of points
    user_coords_cache = {}

    # 2. Select a random sample of 100 star indexes
    star_indexes = random.sample(range(0, 301), 50)

    best_index = None
    best_score = float('inf')
    
    print(f"Selected star indexes: {star_indexes}")

    # 3. Iterate over the random star indexes and compare
    for idx in star_indexes:
        # Get the star constellation coordinates for this index
        star_coords = get_coordinates_by_index(idx, "coordinates")  # Returns list of (x, y)
        if not star_coords:
            continue  # Skip if no coordinates for this index
        
        # Use the number of star points as the desired points for user drawing
        num_points = len(star_coords)
        
        # Check if we already computed the user coordinates for this number of points
        if num_points in user_coords_cache:
            user_coords = user_coords_cache[num_points]
            print(f"Reusing cached user coordinates for {num_points} points.")
        else:
            user_coords = get_coords_from_drawing(usr_image_path, num_points)
            user_coords_cache[num_points] = user_coords
        
        # Compare the user drawing to the star constellation using the Chamfer distance
        score = compare_img(user_coords, star_coords)
        
        # Track the best (lowest) score
        if score < best_score:
            best_score = score
            best_index = idx
    
    #print(f"Best Index: {best_index}")
    return best_index

segment_img(image_path, desired_points)


# user_coords = get_coords_from_drawing(image_path)
best_star_index = find_best_star(image_path)