import React from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();

  // Determine if the current path is the home page
  const isHomePage = location.pathname == "/";
  console.log("object", typeof location.pathname);
  console.log("object", isHomePage);
  return (
    <div className="min-h-screen  bg-gray-100 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            AI meets trusted communications
          </h1>
          <div className="flex justify-center space-x-4 mb-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded">
              Try free
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded">
              Contact sales
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-4 bg-gray-200 rounded">
              <img
                src="/callmanbg.jpg"
                alt="Phone & Message"
                className="w-full h-32 object-cover rounded mb-4"
              />
              <h2 className="font-semibold text-lg mb-2">Phone & Message</h2>
              <p>Smart notes, Transcript, Key updates, Action items</p>
            </div>
            <div className="p-4 bg-gray-200 rounded">
              <img
                src="/calling.jpg"
                alt="Contact Center"
                className="w-full h-32 object-cover rounded mb-4"
              />
              <h2 className="font-semibold text-lg mb-2">Call Management</h2>
              <p>Total calls, 1.2K</p>
            </div>
            <div className="p-4 bg-gray-200 rounded">
              <img
                src="/smsbg.jpg"
                alt="Events & Video"
                className="w-full h-32 object-cover rounded mb-4"
              />
              <h2 className="font-semibold text-lg mb-2">SMS Management</h2>
              <p>Details about all sms</p>
            </div>
            <div className="p-4 bg-gray-200 rounded">
              <img
                src="/admin.jpg"
                alt="Sales Intelligence"
                className="w-full h-32 object-cover rounded mb-4"
              />
              <h2 className="font-semibold text-lg mb-2">Access Control</h2>
              <p>Admin Dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul>
                <li>RingCentral RingEX</li>
                <li>Message</li>
                <li>Video</li>
                <li>Phone</li>
                <li>Fax</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Partners</h3>
              <ul>
                <li>Global service providers</li>
                <li>Channel partners</li>
                <li>ISV partners</li>
                <li>Hardware partners</li>
                <li>Connectivity partners</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Open Ecosystem</h3>
              <ul>
                <li>Developer platform</li>
                <li>APIs</li>
                <li>Integrated apps</li>
                <li>App gallery</li>
                <li>Developer support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul>
                <li>What's new</li>
                <li>Resource center</li>
                <li>Blog</li>
                <li>Customer stories</li>
                <li>Newsroom</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
