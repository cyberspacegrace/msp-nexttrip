// Package imports
import { useState, useEffect } from 'react';

// Module imports
import CustomSelect from './components/CustomSelect';

// Image and Style imports
import bus from './images/bus.png';
import './App.css';

const App = () => {
  // Base API url
  const apiUrl = 'https://svc.metrotransit.org/nextripv2';

  const [routes, setRoutes] = useState([]);
  const [directions, setDirections] = useState([]);
  const [stops, setStops] = useState([]);
  const [departures, setDepartures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
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
      })
      .finally(() => {
        setLoading(false);
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
        <img src={bus} className="App-logo" alt="logo" />
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
      </header>
        <CustomSelect
          options={routeOptions()}
          setSelected={(option) => setGivenRoute(option.value)}
        />
        {directions.length > 0 &&
          <CustomSelect
            options={directionOptions()} 
            setSelected={(option) => setGivenDirection(option.value)} 
          />
        }
        {stops.length > 0 && 
          <CustomSelect
            options={stopOptions()}
            setSelected={(option) => setGivenStop(option.value)}
          />
        }
        {departures && (
        <table>
          <thead>
            <tr key={'header'}>
              <th>Route</th>
              <th>Destination</th>
              <th>Departs</th>
            </tr>
          </thead>
          <tbody>
            {generateDepartureTable()}
          </tbody>
        </table>
        )}
    </div>
  );
}

export default App;
