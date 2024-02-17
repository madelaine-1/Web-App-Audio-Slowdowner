import requests

url = "http://127.0.0.1:8000"


data = {
    "username": "test1",
    "email": "test@gmail.com",
    "password": "admin"
}
response = requests.post(f"{url}/users", json=data)

print(f"Response code: {response.status_code}\njson: {response.json()}")

    