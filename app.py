from flask import Flask, request, render_template, jsonify
import json
import requests
app = Flask(__name__)

# Ensure Flask can find static files like CSS and JavaScript
app = Flask(__name__, static_url_path='/static')

# Fetch API key from environment variables
OPENROUTER_API_KEY = "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"

# Check if API key is correctly retrieved
if OPENROUTER_API_KEY is None:
    print("API key not found. Please set the environment variable OPENROUTER_API_KEY.")
    exit()

YOUR_SITE_URL = "http://localhost"
YOUR_APP_NAME = "AlphaX"

# Serve the index.html
@app.route('/')
def index():
    return render_template('index.html')

# API route for the chat functionality
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_prompt = data.get('prompt')

    # Make the API request
    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Referer": YOUR_SITE_URL,
            "X-Title": YOUR_APP_NAME,
            "Content-Type": "application/json"
        },
        data=json.dumps({
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": user_prompt
                }
            ]
        })
    )

    if response.status_code == 200:
        result = response.json()
        return jsonify({'response': result['choices'][0]['message']['content']})
    else:
        return jsonify({'response': f"Error {response.status_code}: {response.text}"}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)

