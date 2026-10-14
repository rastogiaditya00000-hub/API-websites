import React from "react";
import empData from "./emp.json";
import "./emp.css";

const Emp = () => {
  return (
    <div className="emp-container">
      <h1 className="emp-title">
        Mamaearth Operations Team
      </h1>

      <div className="emp-list">
        {empData.employees.map((a) => (
          <div className="employee-card" key={a.employeeId}>
            <h3>{a.fullName}</h3>

            <p><strong>ID:</strong> {a.employeeId}</p>
            <p><strong>Email:</strong> {a.email}</p>
            <p><strong>Department:</strong> {a.department}</p>
            <p><strong>Team:</strong> {a.team}</p>
            <p><strong>Designation:</strong> {a.designation}</p>
            <p><strong>Location:</strong> {a.location}</p>

            <hr className="employee-divider" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Emp;
