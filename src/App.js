import logo from './logo.svg';
import './App.css';
import full_data from './data/data.json';
import BarChart from './charts/BarChart';
import DoughnutChart from './charts/DoughnutChart';
import ParallelCoordinatePlotAllColumns from './charts/ParallelCoordinatePlotAllColumns';

function App() {

  
  var data = full_data.filter(d => d.Year && d.Laid_Off && d.Laid_Off < 500 && d.Industry && d.Percentage && d.Money_Raised_in_$_mil && d.Country == "USA" && d.Stage != "Unknown" && d.After_layoffs < 5000);
  
  // console.log(data);
  const dimension = "Year";

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

      <div class= "row1"> 
        <span class= "column1">
          <BarChart data={data} dimension={dimension} />
        </span>
        <span class= "column2">
          <DoughnutChart data={data} dimension={dimension} />
        </span>
        <span>
          <ParallelCoordinatePlotAllColumns data={data} />
        </span>
      </div>



    </div>
  );
}

export default App;
