import bus from './images/bus.png';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={bus} className="App-logo" alt="logo" />
        <p className="App-header-text">
          NextTrip
        </p>
        <p>
          Your source for Minneapolis Metro Transit bus line information
        </p>
        <a
          className="App-link"
          href="https://www.metrotransit.org/nextrip"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Real-Time Departures
        </a>
      </header>
    </div>
  );
}

export default App;
