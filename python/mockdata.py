import json
import requests

# Define the URL of your Express server
express_url = "http://localhost:6969"

# Load data from a JSON file
with open("parents-students.json", "r", encoding="utf-8") as json_file:
    data = json.load(json_file)

# Assuming your JSON file contains an array of objects with a structure similar to the one in your Express code
# You can iterate over the objects and make POST requests
for obj in data:
    try:
        # Serialize the object to JSON and encode it as UTF-8
        json_data = json.dumps(obj, ensure_ascii=False).encode("utf-8")

        response = requests.post(f"{express_url}/students", data=json_data, headers={"Content-Type": "application/json; charset=utf-8"})
        if response.status_code == 201:
            print(f"Successfully added object: {obj}")
        else:
            print(f"Failed to add object: {obj}")
    except Exception as e:
        print(f"Error while making the request: {e}")
