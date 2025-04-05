# utils.py - Utility functions
import os

def create_directory(directory_path):
    """
    Create a directory if it doesn't exist
    
    Args:
        directory_path (str): Path to the directory to create
    """
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)
        print(f"Created directory: {directory_path}")