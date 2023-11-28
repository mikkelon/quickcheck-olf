import firebase_admin
from firebase_admin import credentials, firestore
from subprocess import call

# Initialize Firebase Admin SDK with your service account credentials
cred = credentials.Certificate('../service-account.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

# List of collection names to delete
collections_to_delete = ["parents", "students", "users"]

# Delete collections
for collection_name in collections_to_delete:
    collection_ref = db.collection(collection_name)
    docs = collection_ref.stream()
    for doc in docs:
        doc.reference.delete()
    print(f"Deleted collection: {collection_name}")

# Run the deleteusers.py script
call(["python", "deleteusers.py"])

# Clean up and delete the Firebase Admin SDK's default app
firebase_admin.delete_app(firebase_admin.get_app())

print("Collections and users have been deleted.")
