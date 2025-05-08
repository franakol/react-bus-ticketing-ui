import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { routeService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await routeService.getAllRoutes();
        setRoutes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError('Failed to load routes. Please try again later.');
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const filteredRoutes = routes.filter(route => {
    const searchLower = searchTerm.toLowerCase();
    return (
      route.origin.toLowerCase().includes(searchLower) ||
      route.destination.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-light">Available Routes</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search routes..."
            className="input pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <Card className="bg-red-900/20 border border-red-800">
          <p className="text-red-400">{error}</p>
        </Card>
      ) : filteredRoutes.length === 0 ? (
        <Card>
          <p className="text-gray-400 text-center py-4">
            {searchTerm ? 'No routes found matching your search.' : 'No routes available at the moment.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <Card key={route.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-primary">
                  {route.origin} to {route.destination}
                </h3>
                <span className="bg-dark px-2 py-1 rounded text-xs font-medium text-secondary">
                  {route.distance} km
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">
                  <span className="text-gray-300">Duration:</span> {route.duration} hours
                </p>
                <p className="text-gray-400 text-sm">
                  <span className="text-gray-300">Description:</span> {route.description || 'Standard route'}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-secondary font-bold">
                  From {route.base_price.toLocaleString()} RWF
                </span>
                <Link to={`/schedules?routeId=${route.id}`}>
                  <Button variant="accent" className="text-sm">View Schedules</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Routes;
