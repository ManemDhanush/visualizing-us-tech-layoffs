from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import pandas as pd

app = Flask(__name__)
CORS(app)

df = pd.read_csv("final_data.csv").groupby('state')['Laid_Off'].sum()
map = {}

for state, total in df.items():
    map[state] = total

@app.route("/getMapData", methods=['POST'])
def getMapData():
    file = open('us-states-default.json')
    data = json.load(file)

    for cord in data["features"]:
        if cord["properties"]["name"] in map:
            cord["value"] = map[cord["properties"]["name"]]

    file.close()

    return data

if __name__ == "__main__":
    app.run(debug = True)


