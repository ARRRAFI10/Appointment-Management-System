import axios from "axios";
import React, { useEffect, useState } from "react";

const DoctorSummary = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ start_date: "", end_date: "" });

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line
  }, []);

  const fetchSummary = async (params = {}) => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get("http://127.0.0.1:8000/api/accounts/doctor/appointment-summary/", {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setSummary(res.data);
    } catch (err) {
      setError("Failed to load summary");
    }
  };

  const handleFilter = e => {
    e.preventDefault();
    fetchSummary(filter);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Appointment & Earnings Summary</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter Form */}
      <form className="mb-4" onSubmit={handleFilter}>
        <div className="row g-2 align-items-end justify-content-center">
          <div className="col-auto">
            <label className="form-label mb-0">From</label>
            <input
              type="date"
              className="form-control"
              value={filter.start_date}
              onChange={e => setFilter({ ...filter, start_date: e.target.value })}
              required
            />
          </div>
          <div className="col-auto">
            <label className="form-label mb-0">To</label>
            <input
              type="date"
              className="form-control"
              value={filter.end_date}
              onChange={e => setFilter({ ...filter, end_date: e.target.value })}
              required
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" type="submit">Filter</button>
          </div>
        </div>
      </form>

      {/* Summary Cards */}
      {summary && (
        <div className="row g-4">
          {/* This Month */}
          <div className="col-md-3 col-sm-6">
            <div className="card border-success shadow h-100">
              <div className="card-header bg-success text-white text-center fw-bold">This Month</div>
              <div className="card-body text-center">
                <p className="mb-1"><b>Completed:</b> {summary.this_month.total_completed}</p>
                <p className="mb-1"><b>Pending:</b> {summary.this_month.total_pending}</p>
                <p className="mb-0"><b>Earned:</b> <span className="text-success">{summary.this_month.total_earned}</span></p>
              </div>
            </div>
          </div>
          {/* Last Month */}
          <div className="col-md-3 col-sm-6">
            <div className="card border-info shadow h-100">
              <div className="card-header bg-info text-white text-center fw-bold">Last Month</div>
              <div className="card-body text-center">
                <p className="mb-1"><b>Completed:</b> {summary.last_month.total_completed}</p>
                <p className="mb-1"><b>Pending:</b> {summary.last_month.total_pending}</p>
                <p className="mb-0"><b>Earned:</b> <span className="text-info">{summary.last_month.total_earned}</span></p>
              </div>
            </div>
          </div>
          {/* This Year */}
          <div className="col-md-3 col-sm-6">
            <div className="card border-warning shadow h-100">
              <div className="card-header bg-warning text-dark text-center fw-bold">This Year</div>
              <div className="card-body text-center">
                <p className="mb-1"><b>Completed:</b> {summary.this_year.total_completed}</p>
                <p className="mb-1"><b>Pending:</b> {summary.this_year.total_pending}</p>
                <p className="mb-0"><b>Earned:</b> <span className="text-warning">{summary.this_year.total_earned}</span></p>
              </div>
            </div>
          </div>
          {/* Last Year */}
          <div className="col-md-3 col-sm-6">
            <div className="card border-secondary shadow h-100">
              <div className="card-header bg-secondary text-white text-center fw-bold">Last Year</div>
              <div className="card-body text-center">
                <p className="mb-1"><b>Completed:</b> {summary.last_year.total_completed}</p>
                <p className="mb-1"><b>Pending:</b> {summary.last_year.total_pending}</p>
                <p className="mb-0"><b>Earned:</b> <span className="text-secondary">{summary.last_year.total_earned}</span></p>
              </div>
            </div>
          </div>
          {/* Filtered */}
          {summary.filtered && (
            <div className="col-12">
              <div className="card border-primary shadow">
                <div className="card-header bg-primary text-white text-center fw-bold">Filtered Range</div>
                <div className="card-body text-center">
                  <p className="mb-1"><b>Completed:</b> {summary.filtered.total_completed}</p>
                  <p className="mb-1"><b>Pending:</b> {summary.filtered.total_pending}</p>
                  <p className="mb-0"><b>Earned:</b> <span className="text-primary">{summary.filtered.total_earned}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorSummary;