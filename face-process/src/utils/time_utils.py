# time_utils.py
import time

def convert_str_to_timestamp(time_str):
    """
    Convert string representation of time to timestamp.
    
    Args:
        time_str (str): Time string to convert
    
    Returns:
        float: Timestamp
    """
    try:
        struct_time = time.strptime(time_str, "%Y-%m-%d %H:%M:%S")
        return time.mktime(struct_time)
    except ValueError:
        return None
