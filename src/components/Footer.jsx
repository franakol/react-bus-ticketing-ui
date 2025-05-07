const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark border-t border-gray-700 py-8 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">BusTicket</h3>
            <p className="text-gray-400">Your reliable partner for bus ticket booking. Travel with comfort and ease.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-light mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-primary transition-colors">Home</a></li>
              <li><a href="/routes" className="text-gray-400 hover:text-primary transition-colors">Routes</a></li>
              <li><a href="/schedules" className="text-gray-400 hover:text-primary transition-colors">Schedules</a></li>
              <li><a href="/bookings" className="text-gray-400 hover:text-primary transition-colors">My Bookings</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-light mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">Email: info@busticket.com</li>
              <li className="text-gray-400">Phone: +250 788 888 888</li>
              <li className="text-gray-400">Address: 123 KG St, Kigali</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} BusTicket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
