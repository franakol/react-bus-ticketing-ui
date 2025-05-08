import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { routeService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        const response = await routeService.getAllRoutes();
        // In a real app, you might have an endpoint for popular routes
        // For now, we'll just use the first few routes
        setPopularRoutes(response.data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError('Failed to load popular routes. Please try again later.');
        setLoading(false);
      }
    };

    fetchPopularRoutes();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-dark rounded-lg overflow-hidden mb-12">
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Book Your Bus Tickets <span className="text-primary">Online</span>
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                Travel with comfort and ease. Book your bus tickets online and enjoy a hassle-free journey.
              </p>
              <div className="flex space-x-4">
                <Link to="/routes">
                  <Button variant="primary">View Routes</Button>
                </Link>
                <Link to="/schedules">
                  <Button variant="secondary">Check Schedules</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" 
                alt="Bus Travel" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light mb-6">Popular Routes</h2>
        
        {loading ? (
          <div className="py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <Card className="bg-red-900/20 border border-red-800">
            <p className="text-red-400">{error}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route) => (
              <Card key={route.id} className="hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {route.origin} to {route.destination}
                </h3>
                <p className="text-gray-400 mb-4">{route.distance} km</p>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-bold">
                    From {route.base_price.toLocaleString()} RWF
                  </span>
                  <Link to={`/routes/${route.id}`}>
                    <Button variant="accent" className="text-sm">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link to="/routes">
            <Button variant="primary">View All Routes</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light mb-6">Why Choose Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-primary mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-light mb-2">Secure Booking</h3>
            <p className="text-gray-400">Our secure payment system ensures your transactions are safe and protected.</p>
          </Card>
          
          <Card>
            <div className="text-secondary mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115 16.5a2.5 2.5 0 012 1V8a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-light mb-2">Wide Network</h3>
            <p className="text-gray-400">Access to a wide network of bus operators covering all major routes.</p>
          </Card>
          
          <Card>
            <div className="text-accent mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-light mb-2">24/7 Support</h3>
            <p className="text-gray-400">Our customer support team is available 24/7 to assist you with any queries.</p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
