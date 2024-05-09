import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import full_data from "./data/data.json";
import BarChart from "./charts/BarChart";
import DoughnutChart from "./charts/DoughnutChart";
import ParallelCoordinatePlotAllColumns from "./charts/ParallelCoordinatePlotAllColumns";
import PCP from "./charts/PCP";
import LineChart from "./charts/LineChart";
// import DonutChart from "./charts/DonutChart";
// import ScatterPlot from "./charts/ScatterPlot";
import ChoroplethMap from "./charts/ChoroplethMap";
import * as d3 from "d3";



function App() {

  useEffect(() => {
    console.log("This is re rendering");
  }, []);

  const parseDate = d3.timeParse("%Y-%m-%d");

  const [data, setData] = useState(full_data.filter(
    (d) =>
      d.Year &&
      d.Laid_Off &&
      // d.Laid_Off < 500 &&
      d.Industry &&
      d.Percentage &&
      d.Money_Raised_in_$_mil &&
      d.Stage != "Unknown"
      // d.After_layoffs < 5000
  ));

  const tempData = full_data.filter(
    (d) =>
      d.Year &&
      d.Laid_Off &&
      // d.Laid_Off < 500 &&
      d.Industry &&
      d.Percentage &&
      d.Money_Raised_in_$_mil &&
      d.Stage != "Unknown"
      // d.After_layoffs < 5000
  );

  const [lineData, setlineData] = useState(full_data.filter(
    (d) =>
      d.Year &&
      d.Laid_Off &&
      // d.Laid_Off < 500 &&
      d.Industry &&
      d.Percentage &&
      d.Money_Raised_in_$_mil &&
      d.Stage != "Unknown"
      // d.After_layoffs < 5000
  ));

  const [industry, setIndustry] = useState(null);
  const handleIndustryChange = (industry) => {
    // console.log(industry);
    setIndustry(industry);
  };

  const [state, setState] = useState("");
  // console.log(state+"old state");
  const handleStateChange = (newState) => {
    // console.log(newState+"newState");
    // console.log(state+"state");
    setState(newState);

    // state === newState ? setState("Yasa") : setState(newState);


    // if (state) {
    //   setData(full_data.filter((d) => d.state === state));
    // } else {
    //   setData(full_data.filter(
    //     (d) =>
    //       d.Year &&
    //       d.Laid_Off &&
    //       d.Laid_Off < 500 &&
    //       d.Industry &&
    //       d.Percentage &&
    //       d.Money_Raised_in_$_mil &&
    //       d.Stage != "Unknown" &&
    //       d.After_layoffs < 5000
    //   ));
    // }

    // console.log(state);
  };

  const [range, setRange] = useState(null);
  const handleRangeChange = (range) => {
    // console.log(range);
    if (range) {
      const start = range[0];
      const end = range[1];
      // console.log(start, end);

      setData(tempData.filter((d) => parseDate(d.Date_layoffs) >= start && parseDate(d.Date_layoffs) <= end));
      // setData(full_data.filter((d) => d.Year >= range[0] && d.Year <= range[1]));
      setRange(range);
    }
  };

  console.log(full_data);

  const [mapData, setMapData] = useState({
    state: "US",
    choroplethMap: null,
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


  

  // console.log(data);
  const dimension = "Industry";

  return (
    <>
      {/* <NavBar /> */}
      <div 
        style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}>
        <h1>Tech Layoffs Visualization</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1%",
        }}
      >
        <div
          style={{
            flex: "1",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            padding: "20px",
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
            STATE-WISE LAYOFFS
          </div>
          <div style={{paddingLeft: "25px", paddingTop: "25px"}}>
            {mapData.choroplethMap !== null && (
              <ChoroplethMap props={mapData} state = {state} handleStateChange={handleStateChange} />
            )}
          </div>

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
            INDUSTRY-WISE LAYOFFS
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
            COMPANY-WISE LAYOFFS
          </div>
          <DoughnutChart data={data} state={state} industry={industry}/>
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
            <PCP data={data} />
          </div>
        </div>
        {/* <div
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
        </div> */}
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
            <LineChart data={lineData} handleRangeChange={handleRangeChange} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
