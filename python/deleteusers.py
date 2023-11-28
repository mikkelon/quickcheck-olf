import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase Admin SDK
cred = credentials.Certificate('../service-account.json')
firebase_admin.initialize_app(cred)

# Fetch a list of all users
all_users = auth.list_users()

# Iterate through the list and delete each user
for user in all_users.users:
    try:
        auth.delete_user(user.uid)
        print(f"Deleted user: {user.uid}")
    except Exception as e:
        print(f"Failed to delete user {user.uid}: {str(e)}")

# Optional: Delete the Firebase Admin SDK's default app
firebase_admin.delete_app(firebase_admin.get_app())

print("All users have been deleted.")
