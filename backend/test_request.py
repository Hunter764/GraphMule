import requests
import time
import sys
import json

def wait_for_server(url, timeout=30):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(url)
            if response.status_code == 200:
                print("Server is ready.")
                return True
        except requests.ConnectionError:
            time.sleep(1)
            print("Waiting for server...")
    return False

def test_analyze():
    base_url = "http://localhost:8000"
    if not wait_for_server(base_url):
        print("Server failed to start.")
        sys.exit(1)

    url = f"{base_url}/analyze"
    files = {'file': open('backend/test_data.csv', 'rb')}
    
    try:
        response = requests.post(url, files=files)
        if response.status_code == 200:
            print("Analysis Result:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_analyze()
