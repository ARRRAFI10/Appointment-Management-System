import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css"; // Create this for custom styles

const Landing = () => (
  <div className="landing-bg">
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold text-success fs-3">
          Bangladesh HealthCare Portal
        </span>
        <div>
          <Link to="/login" className="btn btn-outline-success me-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-success">
            Register
          </Link>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <header className="container text-center py-5">
      <h1 className="display-4 fw-bold mb-3">
        Make Healthcare Simple in Bangladesh
      </h1>
      <p className="lead mb-4">
        Book doctor appointments, manage schedules, and get reports – all in one place.
      </p>
      <Link to="/register" className="btn btn-lg btn-success px-4">
        Get Started
      </Link>
    </header>

    {/* Features Section */}
    <section className="container py-5">
      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <i className="bi bi-calendar2-check display-3 text-success"></i>
          <h5 className="mt-3 fw-bold">Easy Appointment Booking</h5>
          <p>
            Select a doctor, choose a time, and book instantly. No more waiting in lines!
          </p>
        </div>
        <div className="col-md-4 mb-4">
          <i className="bi bi-person-badge display-3 text-primary"></i>
          <h5 className="mt-3 fw-bold">Doctor & Patient Profiles</h5>
          <p>
            Manage your profile, view appointment history, and keep your information up to date.
          </p>
        </div>
        <div className="col-md-4 mb-4">
          <i className="bi bi-bar-chart-line display-3 text-info"></i>
          <h5 className="mt-3 fw-bold">Reports & Analytics</h5>
          <p>
            Get monthly reports, track visits, and analyze your healthcare journey.
          </p>
        </div>
      </div>
    </section>

    {/* About Section */}
    <section className="container py-4">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4 mb-md-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="Bangladesh Healthcare"
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h3 className="fw-bold">Our Mission</h3>
          <p>
            We aim to make healthcare accessible and efficient for everyone in Bangladesh.
            Our platform connects patients and doctors, streamlines appointment booking,
            and empowers healthcare providers with powerful tools and analytics.
          </p>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-light text-center py-3 mt-5">
      <small>
        © 2024 Bangladesh HealthCare Portal | Contact: info@healthcarebd.com
      </small>
    </footer>
  </div>
);

export default Landing;