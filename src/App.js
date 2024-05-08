import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import full_data from "./data/data.json";
import BarChart from "./charts/BarChart";
import DoughnutChart from "./charts/DoughnutChart";
import ParallelCoordinatePlotAllColumns from "./charts/ParallelCoordinatePlotAllColumns";
import PCP from "./charts/PCP";
import LineChart from "./charts/LineChart";
import DonutChart from "./charts/DonutChart";
import ScatterPlot from "./charts/ScatterPlot";
import ChoroplethMap from "./charts/ChoroplethMap";



function App() {

  const [industry, setIndustry] = useState(null);
  const handleIndustryChange = (industry) => {
    console.log(industry);
    setIndustry(industry);
  };

  const [state, setState] = useState(null);

  const getQuarter = (month) => {
    return Math.ceil(month / 3);
  };

  console.log(full_data);

  const [mapData, setMapData] = useState({
    state: "US",
    start: "2020-03-01",
    end: "2024-04-01",
    choroplethMap: null,
    histData: null,
    parallelData: null,
    circlePackingData: null,
    scatterplotDataFunding: null,
    scatterplotDataCompany: null,
    scatterplotDataIndustry: null,
  });

  useEffect(() => {
    fetch("http://localhost:5000/getMapData",{
         method: 'POST',
         body: JSON.stringify(mapData)
     })
    .then(response =>response.json())
    .then(mapData => {
        setMapData((prevState) => ({
          ...prevState,
          choroplethMap: mapData,
        }));
    });
  }, [mapData.state, mapData.start, mapData.end]);

  const handleStateChange = (state) => {
    console.log(state);
    setMapData({...mapData, state: state});
    setState(state);
  };


  var data = full_data.filter(
    (d) =>
      d.Year &&
      d.Laid_Off &&
      d.Laid_Off < 500 &&
      d.Industry &&
      d.Percentage &&
      d.Money_Raised_in_$_mil &&
      d.Stage != "Unknown" &&
      d.After_layoffs < 5000
  );

  const dataWithQuarter = data.map((item) => ({
    ...item,
    YearQuarter: `${item.Year}-Q${getQuarter(
      new Date(item.Date_layoffs).getMonth() + 1
    )}`, // Adding 1 because months are zero-based
  }));

  console.log(data);
  const dimension = "Industry";

  return (
    <>
      {/* <NavBar /> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.4%",
        }}
      >
        <div
          style={{
            flex: "1",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            STATEWISE LAYOFFS
          </div>
          {mapData.choroplethMap !== null && (
            <ChoroplethMap props={mapData} handleStateChange={handleStateChange} />
          )}
        </div>
        <div
          style={{
            flex: "1",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            STATEWISE LAYOFFS
          </div>
          <BarChart data={data} dimension={dimension} state={state} handleIndustryChange={handleIndustryChange}/>
        </div>
        <div
          style={{
            flex: "1",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            STATEWISE LAYOFFS
          </div>
          <ScatterPlot data={data} dimensionX="After_layoffs" dimensionY="Laid_Off" xIsCategorical={false} yIsCategorical={false}/>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            flex: "1",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              marginBottom: "0px",
            }}
          >
            PARALLEL COORDINATES PLOT
          </div>
          <div style={{ marginLeft: "1%", flex: "1" }}>
            <PCP props={{ parallelData: data }} />
          </div>
        </div>
        <div
          style={{
            flex: "1",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            padding: "10px",
            marginBottom: "10px",
            marginLeft: "10px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            INDUSTRY WIDE LAYOFFS
          </div>
          <div style={{ flex: "1" }}>
            <DoughnutChart data={dataWithQuarter} dimension={"YearQuarter"} state={state} industry={industry}/>
          </div>
        </div>
        <div
          style={{
            flex: "1",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            padding: "10px",
            marginBottom: "10px",
            marginLeft: "10px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            TIME SERIES CHART
          </div>
          <div style={{ flex: "1" }}>
            <LineChart data={data} />
          </div>
        </div>
      </div>
      {/* <div>
        <div
          style={{
            flex: "1",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            padding: "10px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              marginBottom: "0px",
            }}
          >
            TIME SERIES CHART
          </div>
          <div style={{ flex: "1" }}>
            <LineChart data={dataWithQuarter} />
          </div>
        </div>
      </div> */}
    </>
  );

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <div class="row1">
        <span class="column1">
          <BarChart data={data} dimension={dimension} />
        </span>
        <span class="column2">
          <BarChart data={data} dimension="Year" />
        </span>
        {/* <span class= "column2">
          <DoughnutChart data={data} dimension={dimension} />
        </span>
        <span>
          <ParallelCoordinatePlotAllColumns data={data} />
        </span> */}
      </div>
    </div>
  );
}

export default App;
