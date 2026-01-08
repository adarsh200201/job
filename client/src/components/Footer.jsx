import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3">
            <h5 className="fw-bold mb-3">Job For Fresher</h5>
            <p className="text-white-50">
              Your trusted source for fresher job opportunities, internships, and career guidance. 
              We help fresh graduates find their dream jobs.
            </p>
          </div>
          <div className="col-md-3 mb-3">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/?type=Full-Time" className="text-white-50 text-decoration-none">Jobs</Link></li>
              <li className="mb-2"><Link to="/?type=Internship" className="text-white-50 text-decoration-none">Internship</Link></li>
              <li className="mb-2"><Link to="/?type=Remote" className="text-white-50 text-decoration-none">Work From Home</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-3">
            <h6 className="fw-bold mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/about" className="text-white-50 text-decoration-none">About Us</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-white-50 text-decoration-none">Contact Us</Link></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Terms and Conditions</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <hr className="bg-white-50 my-3" />
        <div className="text-center text-white-50">
          <p className="mb-0">Copyright © {new Date().getFullYear()} Job For Fresher | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
