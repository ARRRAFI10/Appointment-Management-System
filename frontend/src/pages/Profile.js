import axios from "axios";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/accounts/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile. Please login again.");
      }
    };
    fetchProfile();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-3 text-center mb-4 mb-md-0">
          {profile.profile_image ? (
            <img
              src={`http://127.0.0.1:8000${profile.profile_image}`}
              alt="Profile"
              className="rounded-circle shadow"
              width={140}
              height={140}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
              style={{ width: 140, height: 140, color: "#fff", fontSize: 48 }}
            >
              {profile.full_name.charAt(0)}
            </div>
          )}
        </div>
        <div className="col-md-9">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-3">{profile.full_name}</h3>
              <div className="row">
                <div className="col-md-6">
                  <p><b>Email:</b> {profile.email}</p>
                  <p><b>Mobile:</b> {profile.mobile}</p>
                  <p><b>User Type:</b> {profile.user_type}</p>
                  <p><b>Division:</b> {profile.division}</p>
                  <p><b>District:</b> {profile.district}</p>
                  <p><b>Thana:</b> {profile.thana}</p>
                  <p><b>Address:</b> {profile.address}</p>
                </div>
                {profile.user_type === "doctor" && (
                  <div className="col-md-6">
                    <p><b>License Number:</b> {profile.license_number}</p>
                    <p><b>Experience Years:</b> {profile.experience_years}</p>
                    <p><b>Consultation Fee:</b> {profile.consultation_fee}</p>
                    <p><b>Available Timeslots:</b> {profile.available_timeslots}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;