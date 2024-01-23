import requests

url = "http://127.0.0.1:8000/users/"

data = {
    "username": "username",
    "email": "email@example.com",
    "password": "your_password"

}


# response = requests.post("http://127.0.0.1:8000/users/", json=data)
response = requests.get(url)

print(response.json())