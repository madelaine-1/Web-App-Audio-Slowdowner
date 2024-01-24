import requests

url = "http://127.0.0.1:8000/login/"

data = {
    "username": "admin",
    "password": "admin"

}


# response = requests.post("http://127.0.0.1:8000/users/", json=data)
response = requests.post(url, json=data)

print(response.json())