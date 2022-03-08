// Package imports
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

// Module imports
import CustomSelect from './components/CustomSelect';

// Image and Style imports
import bus from './images/bus.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/montserrat';

const App = () => {
  // Base API url
  const apiUrl = 'https://svc.metrotransit.org/nextripv2';

  // State to track retrieved routes, directions, stops, and departure information
  const [routes, setRoutes] = useState([]);
  const [directions, setDirections] = useState([]);
  const [stops, setStops] = useState([]);
  const [departures, setDepartures] = useState(null);

  // State to track user selected route, direction, and stop
  const [givenRoute, setGivenRoute] = useState(null);
  const [givenDirection, setGivenDirection] = useState(null);
  const [givenStop, setGivenStop] = useState(null);

  /**
   * Retrieve data from Metro Transit NextTrip API based on specified URL and data to fetch
   * @param {*} url 
   * @param {*} dataToFetch 
   */
  const fetchData = (url, dataToFetch) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        switch (dataToFetch) {
          case 'routes':
            setRoutes(data);
            break;
          case 'directions':
            setDirections(data);
            break;
          case 'stops':
            setStops(data);
            break;
          case 'departures':
            setDepartures(data);
            break;
        }
      })
      .catch((err) => {
        console.log(err.message);
        switch (dataToFetch) {
          case 'routes':
            setRoutes([]);
            break;
          case 'directions':
            setDirections([]);
            break;
          case 'stops':
            setStops([]);
            break;
          case 'departures':
            setDepartures([]);
            break;
        }
      });
  };

  /**
   * Fetch routes on initial render
   */
  useEffect(() => {
    fetchData(`${apiUrl}/routes`, 'routes');
  }, []);

  /**
   * Reset data and fetch directions once given route is updated
   */
  useEffect(() => {
    if (givenRoute !== null) {
      setGivenDirection(null);
      setDirections([]);
      setStops([]);
      setDepartures(null);
      fetchData(`${apiUrl}/directions/${givenRoute}`, 'directions');      
    }
  }, [givenRoute]);

  /**
   * Reset data and fetch stops once given direction is updated
   */
  useEffect(() => {
    if (givenRoute !== null && givenDirection !== null) {
      setGivenStop(null);
      setStops([]);
      setDepartures(null);
      fetchData(`${apiUrl}/stops/${givenRoute}/${givenDirection}`, 'stops');
    }
  }, [givenDirection]);

  /**
   * Fetch departure information once given stop is updated
   */
  useEffect(() => {
    if (givenRoute !== null && givenDirection !== null && givenStop !== null) {
      fetchData(`${apiUrl}/${givenRoute}/${givenDirection}/${givenStop}`, 'departures');
    }
  }, [givenStop]);

  /**
   * Map available routes to be used in Select dropdown component
   * @returns list of routes as { value, label } items
   */
  const routeOptions = () => {
    return routes.map(({ route_id, route_label }) => {
      return { value: route_id, label: route_label };
    });
  };

  /**
   * Map available directions to be used in Select dropdown component
   * @returns list of directions as { value, label } items
   */
  const directionOptions = () => {
    return directions.map(({ direction_id, direction_name }) => {
      return { value: direction_id, label: direction_name };
    });
  };

  /**
   * Map available stops to be used in Select dropdown component
   * @returns list of stops as { value, label } items
   */
  const stopOptions = () => {
    return stops.map(({ place_code, description }) => {
      return { value: place_code, label: description };
    });
  };

  /**
   * Display departure information in table
   * @returns departure information as table data
   */
  const generateDepartureTable = () => {
    if (departures.departures && departures.departures.length) {
      return departures.departures.map((item) => {
        return (
          <tr key={item.departure_time}>
            <td>{item.route_short_name}</td>
            <td>{item.description}</td>
            <td>{item.departure_text}</td>
          </tr>);
      });
    } else {
      return (
      <tr>
        <td>{'No departures at this time'}</td>
      </tr>);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={bus} className="App-logo" alt="logo" id="bus" />
        <div className="App-header-text-container">
          <p className="App-header-text">
            NextTrip
          </p>
          <a
            className="App-link"
            href="https://www.metrotransit.org/nextrip"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Real-Time Departures
          </a>
          <p>
            Select route, direction, and stop to view departure information.
          </p>
        </div>
      </header>
      <div className="App-body">
        <div className="App-dropdowns">
          <CustomSelect
            options={routeOptions()}
            setSelected={(option) => setGivenRoute(option.value)}
            placeholder={'Select Route...'}
          />
          {directions.length > 0 &&
            <CustomSelect
              options={directionOptions()}
              setSelected={(option) => setGivenDirection(option.value)}
              placeholder={'Select Direction...'}
            />
          }
          {stops.length > 0 &&
            <CustomSelect
              options={stopOptions()}
              setSelected={(option) => setGivenStop(option.value)}
              placeholder={'Select Stop...'}
            />
          }
        </div>
        {departures && (
        <Table striped bordered hover>
          <thead>
            <tr key={'header'}>
              <th style={{textAlign: "center"}}>Route</th>
              <th style={{textAlign: "center"}}>Destination</th>
              <th style={{textAlign: "center"}}>Departs</th>
            </tr>
          </thead>
          <tbody>
            {generateDepartureTable()}
          </tbody>
        </Table>
        )}
      </div>
    </div>
  );
}

export default App;
