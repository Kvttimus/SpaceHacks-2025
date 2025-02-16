import cv2
import numpy as np

'''
User will provide image (JPEG/possibly other file formats) and
convert it to a simplified image which kinda looks like a constellation.

This simplified image will be used to compare to all satellite images,
and the closest looking constellation will be found.
'''

def segment_img(image_path, segment_count):
    '''
    Uses the Douglas-Peucker algorithm to simplify image into "segment_count"
    amount of lines
    '''
    # Load the image
    image = cv2.imread(image_path)  # Replace with your image path
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Canny edge detection
    edges = cv2.Canny(gray, 50, 150)

    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Find the contour with the largest area (main contour)
    largest_contour = max(contours, key=cv2.contourArea)

    # Desired number of points
    desired_points = 10

    # Initial epsilon estimate (could be based on contour length)
    epsilon_factor = 0.02
    epsilon = epsilon_factor * cv2.arcLength(largest_contour, True)
    return output

# Helper function to calculate epsilon necessary to reach target number of stars
def calculate_epsilon_for_points(contour, desired_points, epsilon_factor=0.02, tolerance=2):
    epsilon = epsilon_factor * cv2.arcLength(contour, True)
    points = []
    while True:
        approx = cv2.approxPolyDP(contour, epsilon, True)
        if len(approx) == desired_points:
            points = approx
            break
        elif len(approx) < desired_points:
            epsilon -= 1  # Reduce epsilon to keep more points
        else:
            epsilon += 1  # Increase epsilon to reduce points
        # Avoid infinite loop if epsilon doesn't result in desired points
        if abs(len(approx) - desired_points) < tolerance:
            break
    return points