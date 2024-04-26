import logo from './logo.svg';
import './App.css';
import full_data from './data/data.json';
import BarChart from './charts/BarChart';

function App() {

  // console.log(data);

  var data = full_data.filter(d => d.Country == "USA");

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
          <BarChart data={data} dimension={dimension} />
        </span>
      </div>



    </div>
  );
}

export default App;
