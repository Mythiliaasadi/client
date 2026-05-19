import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./AdminDashboard.css";

const socket = io("http://localhost:5000");

function AdminDashboard() {

  const [queues, setQueues] = useState([]);

  const fetchQueues = async () => {
    const res = await fetch("http://localhost:5000/api/queue/all");
    const data = await res.json();
    setQueues(data);
  };

  useEffect(() => {
    fetchQueues();
    socket.on("queueUpdated", fetchQueues);
    return () => socket.off("queueUpdated", fetchQueues);
  }, []);

  const confirmOP = async (id) => {
    await fetch(`http://localhost:5000/api/queue/confirm/${id}`, {
      method: "PUT"
    });
  };

  const completeOP = async (id) => {
    await fetch(`http://localhost:5000/api/queue/complete/${id}`, {
      method: "DELETE"
    });
  };

  return (

    <div className="admin">

      {/* HEADER */}
      <div className="admin-header">
        <h1>HealSync Admin Panel</h1>
        <p>Hospital Queue Management System</p>
      </div>

      {/* STATS */}
      <div className="stats">

        <div className="stat">
          <h2>{queues.length}</h2>
          <p>Total OP</p>
        </div>

        <div className="stat">
          <h2>{queues.filter(q => q.status === "InQueue").length}</h2>
          <p>In Queue</p>
        </div>

        <div className="stat">
          <h2>{queues.filter(q => q.status === "Waiting").length}</h2>
          <p>Waiting</p>
        </div>

      </div>

      {/* LIST */}
      <div className="list">

        {queues.map((q) => (

          <div className="card" key={q._id}>

            <div className="info">

              <h3>{q.patientName}</h3>
              <p>{q.department}</p>

              <span className={`status ${q.status}`}>
                {q.status}
              </span>

            </div>

            <div className="actions">

              {q.status === "Waiting" && (
                <button className="btn-green" onClick={() => confirmOP(q._id)}>
                  Confirm
                </button>
              )}

              <button className="btn-red" onClick={() => completeOP(q._id)}>
                Complete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default AdminDashboard;