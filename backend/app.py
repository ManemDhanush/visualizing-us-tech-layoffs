from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
from objects.Sunburst.Sunburst import location_freq, sunburst

app = Flask(__name__)
CORS(app)

df = pd.read_csv("layoffs.csv")

@app.route("/")
def test():
    return "Test"

@app.route("/getSunburstData")
def getSunBurstData():
    #Sunburst Computation
    k = 4
    location_state_map = {}
    result = df.groupby('location')['total_laid_off'].sum()
    for index, row in df.iterrows():
        location_state_map[row["location"]] = row["state"]
    unique_locations = df["location"].unique()
    sunburst_data_map = {}

    for location in unique_locations:
        count = int(result[location])
        l = location_freq(location, count)
        if location_state_map[location] not in sunburst_data_map:
            sunburst_data_map[location_state_map[location]] = []
        sunburst_data_map[location_state_map[location]].append(l)

    temp_map = {}
    for key, value in sunburst_data_map.items():
        sum = 0
        for t in value:
            sum += t.size
        temp_map[key] = sum
    top_keys = sorted(temp_map, key=lambda x: temp_map[x], reverse=True)[:4]

    sunburst_data = []
    for key, value in sunburst_data_map.items():
        if key in top_keys:
            sunburst_data.append(sunburst(key, value))
    return json.dumps([sb.to_dict() for sb in sunburst_data], default = lambda o: o.__dict__)

@app.route("/getMapData", methods=['POST'])
def getMapData():
    data = request.data
    json_obj = json.loads(data.decode('utf-8'))
    start_date = pd.to_datetime(json_obj['start'])
    end_date = pd.to_datetime(json_obj['end'])
    df['date'] = pd.to_datetime(df['date'])
    condition = ((df["date"] >= start_date) & (df["date"] <= end_date))
    df_temp = df.loc[condition]
    df_map = df_temp.groupby('state_name')['total_laid_off'].sum()
    state_layoff_map = {}
    for state_name, total_laid_off in df_map.items():
        state_layoff_map[state_name] = total_laid_off
    f = open('us-states-default.json')
    data = json.load(f)
    for t in data["features"]:
        if t["properties"]["name"] in state_layoff_map:
            t["value"] = state_layoff_map[t["properties"]["name"]]
    f.close()
    return data

@app.route("/getDatesData")
def getDatesData():
    f = open('dates.json')
    data = json.load(f)
    f.close()
    return jsonify(data)

@app.route("/getPcpData", methods=['POST'])
def getPcpData():
    data = request.data
    json_obj = json.loads(data.decode('utf-8'))
    start_date = pd.to_datetime(json_obj['start'])
    end_date = pd.to_datetime(json_obj['end'])
    df['date'] = pd.to_datetime(df['date'])
    state = json_obj["state"]

    if state == 'US':
        print("The chosen state is " + str(state))
        condition = ((df['date'] >= start_date) & (df['date'] <= end_date))
        df_pcp = df.loc[condition,["state","company","industry","stage","total_laid_off"]]
        df_pcp = df_pcp.sort_values('total_laid_off', ascending=False)
        df_pcp = df_pcp.head(35)
        return json.dumps(df_pcp.to_dict(orient="records"))
    else:
        print("The chosen state is " + str(state))
        condition = ((df["date"] >= start_date) & (df["date"] <= end_date) & (df["state_name"] == str(state)))
        df_pcp = df.loc[condition,["state","company","industry","stage","total_laid_off"]]
        print(df_pcp)
        df_pcp = df_pcp.sort_values('total_laid_off', ascending=False)
        df_pcp = df_pcp.head(35)
        return json.dumps(df_pcp.to_dict(orient="records"))
    # df_pcp = df[["company","industry","state","total_laid_off"]].sort_values('total_laid_off', ascending=False).head(30)


@app.route("/getCirclePackingChartData", methods=['POST'])
def getCirclePackingChartData():
    #CirclePackingChart Computation
    k = 4
    data = request.data
    json_obj = json.loads(data.decode('utf-8'))
    start_date = pd.to_datetime(json_obj['start'])
    end_date = pd.to_datetime(json_obj['end'])
    df['date'] = pd.to_datetime(df['date'])
    state = json_obj["state"]
    if state == 'US':
        condition = ((df["date"] >= start_date) & (df["date"] <= end_date))
        df_parent = df.loc[condition]
        unique_industries = df_parent["industry"].unique()
        industry_map = {}
        for industry in unique_industries:
            df_temp = df_parent[df_parent["industry"] == industry]
            count = int(df_temp['total_laid_off'].sum())
            industry_map[industry] = count

        t = sorted(industry_map, key=industry_map.get, reverse=True)[:k]

        industry_data_map = {}
        for key in t:
            df_temp = df_parent[df_parent["industry"] == key]
            df_group = df_temp.groupby('company')['total_laid_off'].sum()
            sorted_result = df_group.sort_values(ascending=False)
            for company, total_laid_off in sorted_result.head(min(4, len(sorted_result))).items():
                l = location_freq(company, total_laid_off)
                if key not in industry_data_map:
                    industry_data_map[key] = []
                industry_data_map[key].append(l)
        industry_data = []
        for key, value in industry_data_map.items():
            industry_data.append(sunburst(key, value))
        return json.dumps([sb.to_dict() for sb in industry_data], default = lambda o: o.__dict__)
    else:
        condition = ((df["date"] >= start_date) & (df["date"] <= end_date) & (df["state_name"] == str(state)))
        df_parent = df.loc[condition]
        unique_industries = df_parent["industry"].unique()
        industry_map = {}
        for industry in unique_industries:
            df_temp = df_parent[df_parent["industry"] == industry]
            count = int(df_temp['total_laid_off'].sum())
            industry_map[industry] = count

        t = sorted(industry_map, key=industry_map.get, reverse=True)[:k]

        industry_data_map = {}
        for key in t:
            df_temp = df_parent[df_parent["industry"] == key]
            df_group = df_temp.groupby('company')['total_laid_off'].sum()
            sorted_result = df_group.sort_values(ascending=False)
            for company, total_laid_off in sorted_result.head(min(4, len(sorted_result))).items():
                l = location_freq(company, total_laid_off)
                if key not in industry_data_map:
                    industry_data_map[key] = []
                industry_data_map[key].append(l)
        industry_data = []
        for key, value in industry_data_map.items():
            industry_data.append(sunburst(key, value))
        return json.dumps([sb.to_dict() for sb in industry_data], default = lambda o: o.__dict__)

@app.route("/getScatterPlotA", methods=['POST'])
def getScatterPlotA():
    data = request.data
    json_obj = json.loads(data.decode('utf-8'))
    start_date = pd.to_datetime(json_obj['start'])
    end_date = pd.to_datetime(json_obj['end'])
    df['date'] = pd.to_datetime(df['date'])
    state = json_obj["state"]
    if state == 'US':
        condition = ((df["date"] >= start_date) & (df["date"] <= end_date))
        df_temp = df.loc[condition,["total_laid_off","stage"]]
        df_sorted = df_temp.sort_values("total_laid_off", ascending=False).head(100)
        return df_sorted.to_json(orient='records')
    else:
        condition = ((df["date"] >= start_date) & (df["date"] <= end_date) & (df["state_name"] == str(state)))
        df_temp = df.loc[condition,["total_laid_off","stage"]]
        df_sorted = df_temp.sort_values("total_laid_off", ascending=False).head(100)
        return df_sorted.to_json(orient='records')

@app.route("/getScatterPlotB", methods=['POST'])
def getScatterPlotB():
    data = request.data
    json_obj = json.loads(data.decode('utf-8'))
    start_date = pd.to_datetime(json_obj['start'])
    end_date = pd.to_datetime(json_obj['end'])
    df['date'] = pd.to_datetime(df['date'])
    state = json_obj["state"]
    if state == 'US':
        condition = ((df["date"] >= start_date) & (df["date"] <= end_date))
        df_temp = df.loc[condition,["total_laid_off","company"]]
        df_sorted = df_temp.sort_values("total_laid_off", ascending=False).head(20)
        return df_sorted.to_json(orient='records')
    else:
        condition = ((df["date"] >= start_date) & (df["date"] <= end_date) & (df["state_name"] == str(state)))
        df_temp = df.loc[condition,["total_laid_off","company"]]
        df_sorted = df_temp.sort_values("total_laid_off", ascending=False).head(20)
        return df_sorted.to_json(orient='records')

@app.route("/getScatterPlotC", methods=['POST'])
def getScatterPlotC():
    data = request.data
    json_obj = json.loads(data.decode('utf-8'))
    start_date = pd.to_datetime(json_obj['start'])
    end_date = pd.to_datetime(json_obj['end'])
    df['date'] = pd.to_datetime(df['date'])
    state = json_obj["state"]
    if state == 'US':
        condition = ((df["date"] >= start_date) & (df["date"] <= end_date))
        df_temp = df.loc[condition,["total_laid_off","industry"]]
        df_sorted = df_temp.sort_values("total_laid_off", ascending=False).head(40)
        return df_sorted.to_json(orient='records')
    else:
        condition = ((df["date"] >= start_date) & (df["date"] <= end_date) & (df["state_name"] == str(state)))
        df_temp = df.loc[condition,["total_laid_off","industry"]]
        df_sorted = df_temp.sort_values("total_laid_off", ascending=False).head(40)
        return df_sorted.to_json(orient='records')

if __name__ == "__main__":
    app.run(debug = True)


