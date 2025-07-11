import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="container mt-5">
      <h2>My Profile</h2>
      <ul className="list-group">
        <li className="list-group-item"><b>Name:</b> {profile.full_name}</li>
        <li className="list-group-item"><b>Email:</b> {profile.email}</li>
        <li className="list-group-item"><b>Mobile:</b> {profile.mobile}</li>
        <li className="list-group-item"><b>User Type:</b> {profile.user_type}</li>
        <li className="list-group-item"><b>Division:</b> {profile.division}</li>
        <li className="list-group-item"><b>District:</b> {profile.district}</li>
        <li className="list-group-item"><b>Thana:</b> {profile.thana}</li>
        <li className="list-group-item"><b>Address:</b> {profile.address}</li>
        {profile.profile_image && (
          <li className="list-group-item">
            <b>Profile Image:</b><br />
            <img src={`http://127.0.0.1:8000${profile.profile_image}`} alt="Profile" width={100} />
          </li>
        )}
        {profile.user_type === "doctor" && (
          <>
            <li className="list-group-item"><b>License Number:</b> {profile.license_number}</li>
            <li className="list-group-item"><b>Experience Years:</b> {profile.experience_years}</li>
            <li className="list-group-item"><b>Consultation Fee:</b> {profile.consultation_fee}</li>
            <li className="list-group-item"><b>Available Timeslots:</b> {profile.available_timeslots}</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Profile;