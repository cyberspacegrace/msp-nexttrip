// Package imports
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import selectEvent from 'react-select-event';

// Component under test
import App from './App';

const server = setupServer(
  rest.get('https://svc.metrotransit.org/nextripv2/routes', (req, res, ctx) => {
    return res(ctx.json([
      { route_id: 1, route_label: 'Route 1' },
      { route_id: 2, route_label: 'Route 2' },
      { route_id: 3, route_label: 'Route 3' }
    ]));
  }),
  rest.get('https://svc.metrotransit.org/nextripv2/directions/1', (req, res, ctx) => {
    return res(ctx.json([
      { direction_id: 0, direction_name: 'Northbound' },
      { direction_id: 1, direction_name: 'Southbound' }
    ]));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App.js tests', () => {
  test('renders bus image', () => {
    render(<App />);
    const busElement = screen.getByAltText('logo');
    expect(busElement).toBeInTheDocument();
  });
  
  test('renders header text', () => {
    render(<App />);
    const headerText = screen.getByText('NextTrip');
    expect(headerText).toBeInTheDocument();
  });
  
  test('renders link to MetroTransit', () => {
    render(<App />);
    const linkElement = screen.getByText('View Real-Time Departures');
    expect(linkElement).toBeInTheDocument();
  });
  
  test('renders instruction text', () => {
    render(<App />);
    const instructionText = screen
      .getByText('Select route, direction, and stop to view departure information.');
    expect(instructionText).toBeInTheDocument();
  });
  
  test('renders initial routes dropdown', () => {
    render(<App />);
    const routesDropdown = screen.getByText('Select Route...');
    expect(routesDropdown).toBeInTheDocument();
  });

  test('renders directions dropdown after route selection', async () => {
    render(<App />);
    await selectEvent.select(screen.getByText('Select Route...'), ['Route 1']);
    await waitFor(() => screen.getByText('Select Direction...'));
    expect(screen.getByText('Select Direction...')).toBeInTheDocument();
  });
});
