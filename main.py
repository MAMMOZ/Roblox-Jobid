import requests

a = requests.post(f"http://127.0.0.1:3000/mammoz/asasaa/111111")
out = a.text
print(out)