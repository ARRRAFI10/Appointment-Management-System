// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const DoctorAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//     const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/api/accounts/appointments/", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
//     })
//     .then(res => setAppointments(res.data))
//     .catch(err => setError("Failed to load appointments"));
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2>My Appointments</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Patient</th>
//             <th>Date</th>
//             <th>Timeslot</th>
//             <th>Notes</th>
//             <th>Status</th>
//             <th>Prescription</th>
//           </tr>
//         </thead>
//         <tbody>
//           {appointments.map(app => (
//             <tr key={app.id}>
//               <td>{app.patient_name}</td>
//               <td>{app.appointment_date}</td>
//               <td>{app.timeslot}</td>
//               <td>{app.notes}</td>
//               <td>{app.status}</td>
//               <td>
//               <button
//           className="btn btn-sm btn-success"
//           onClick={() => setSelectedAppointment(app)}
//         >
//           {app.prescription ? "Edit Prescription" : "Add Prescription"}
//         </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DoctorAppointments;


import axios from "axios";
import React, { useEffect, useState } from "react";

// Prescription form modal component
const PrescriptionForm = ({ appointment, onClose, onSaved }) => {
  const [content, setContent] = useState(appointment.prescription?.content || "");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("access");
      if (appointment.prescription) {
        // Update existing prescription
        await axios.put(
            `http://127.0.0.1:8000/api/accounts/prescriptions/${appointment.prescription.id}/edit/`,
            { content, appointment: appointment.id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new prescription
        await axios.post(
          "http://127.0.0.1:8000/api/accounts/prescriptions/",
          { content, appointment: appointment.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onSaved();
      onClose();
    } catch (err) {
        setError(
          err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to save prescription"
        );
    }
  };

  return (
    <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">
              Prescription for {appointment.patient_name}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <textarea
              className="form-control"
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              placeholder="Write prescription here..."
            />
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-success">Save</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [error, setError] = useState("");

  const reloadAppointments = () => {
    axios.get("http://127.0.0.1:8000/api/accounts/appointments/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    })
    .then(res => setAppointments(res.data))
    .catch(err => setError("Failed to load appointments"));
  };
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("access");
      await axios.patch(
        `http://127.0.0.1:8000/api/accounts/appointments/${id}/edit/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      reloadAppointments();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    reloadAppointments();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container mt-5">
      <h2>My Appointments</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Timeslot</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Prescription</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(app => (
            <tr key={app.id}>
              <td>{app.patient_name}</td>
              <td>{app.appointment_date}</td>
              <td>{app.timeslot}</td>
              <td>{app.notes}</td>
              <td>
                  <select
                    value={app.status}
                    onChange={e => updateStatus(app.id, e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => setSelectedAppointment(app)}
                >
                  {app.prescription ? "Edit Prescription" : "Add Prescription"}
                </button>
                {app.prescription && (
                  <a
                    href={`http://127.0.0.1:8000/api/accounts/prescriptions/${app.id}/pdf/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-info"
                  >
                    PDF
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedAppointment && (
        <PrescriptionForm
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSaved={reloadAppointments}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;