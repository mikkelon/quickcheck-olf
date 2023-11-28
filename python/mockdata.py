import json
import requests

# Define the URL of your Express server
express_url = "http://localhost:80"

# Load data from a JSON file (in this case, parents-students.json)
with open("parents-students.json", "r", encoding="utf-8") as json_file:
    data = json.load(json_file)

# Send a POST request to the /api/family/create endpoint for each object in the JSON file
for obj in data:
    try:
        # Serialize the object to JSON and encode it as UTF-8
        json_data = json.dumps(obj, ensure_ascii=False).encode("utf-8")

        response = requests.post(f"{express_url}/api/family/create", data=json_data, headers={"Content-Type": "application/json; charset=utf-8"})
        if response.status_code == 201:
            print(f"Successfully added object: {obj}")
        else:
            print(f"Failed to add object: {obj}")
    except Exception as e:
        print(f"Error while making the request: {e}")

# Load data from a JSON file (in this case, test-users.json)
with open("test-users.json", "r", encoding="utf-8") as json_file:
    data = json.load(json_file)

# Send a POST request to the /api/signup/dev endpoint for each object in the JSON file
for obj in data:
    try:
        # Serialize the object to JSON and encode it as UTF-8
        json_data = json.dumps(obj, ensure_ascii=False).encode("utf-8")

        response = requests.post(f"{express_url}/api/signup/dev", data=json_data, headers={"Content-Type": "application/json; charset=utf-8"})
        if response.status_code == 201:
            print(f"Successfully added object: {obj}")
        else:
            print(f"Failed to add object: {obj}")
    except Exception as e:
        print(f"Error while making the request: {e}")