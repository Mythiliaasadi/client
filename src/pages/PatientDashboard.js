import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./PatientDashboard.css";

const socket = io("http://localhost:5000");

function PatientDashboard() {

  const [form, setForm] = useState({
    patientName: "",
    department: "",
    date: ""
  });

  const [patientName, setPatientName] = useState("");
  const [myOP, setMyOP] = useState(null);
  const [queues, setQueues] = useState([]);
  const [joined, setJoined] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {

    const fetchData = async () => {

      const res = await fetch("http://localhost:5000/api/queue/all");
      const data = await res.json();

      setQueues(data);

      const mine = data
        .filter(q => q.patientName === patientName)
        .slice(-1)[0];

      setMyOP(mine || null);

      if (mine && mine.status === "InQueue") {

        const queueList = data.filter(q => q.status === "InQueue");

        const position = queueList.findIndex(q => q._id === mine._id);

        if (position >= 0 && position <= 2) {
          setNotification("🔔 Your OP is near! Please be ready");
        } else {
          setNotification("");
        }

      } else {
        setNotification("");
      }

    };

    fetchData();

    socket.on("queueUpdated", fetchData);

    return () => socket.off("queueUpdated", fetchData);

  }, [patientName]);

  const bookOP = async () => {

    await fetch("http://localhost:5000/api/queue/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setPatientName(form.patientName); // 🔥 IMPORTANT FIX

    alert("OP Booked Successfully");
  };

  const joinQueue = async (id) => {

    await fetch(`http://localhost:5000/api/queue/join/${id}`, {
      method: "PUT"
    });

    setJoined(true);
  };

  return (

    <div className="app">

      {notification && (
        <div className="toast">{notification}</div>
      )}

      <div className="top-bar">
        <h1>HealSync</h1>
        <p>Smart Hospital Queue System</p>
      </div>

      {!myOP && (
        <div className="glass-card">

          <h2>Book OP Appointment</h2>

          <input
            placeholder="Patient Name"
            onChange={(e) =>
              setForm({ ...form, patientName: e.target.value })
            }
          />

          <input
            placeholder="Department"
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          />

          <input
            type="date"
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <button className="primary-btn" onClick={bookOP}>
            Book Appointment
          </button>

        </div>
      )}

      {myOP && !joined && (
        <div className="glass-card">

          <h2>Your OP Status</h2>

          <p><b>Name:</b> {myOP.patientName}</p>
          <p><b>Department:</b> {myOP.department}</p>
          <p><b>Status:</b> {myOP.status}</p>

          {myOP.status === "Confirmed" && (
            <button className="success-btn" onClick={() => joinQueue(myOP._id)}>
              Join Queue
            </button>
          )}

          {myOP.status === "Waiting" && (
            <p className="wait-text">Waiting for admin confirmation...</p>
          )}

        </div>
      )}

      {joined && (
        <div className="glass-card">

          <h2>Live OP Queue</h2>

          {queues.map((q, i) => (

            <div className="queue-row" key={q._id}>

              <span className="badge">{i + 1}</span>

              <div>
                <h4>{q.patientName}</h4>
                <small>{q.status}</small>
              </div>

            </div>

          ))}

        </div>
      )}

    </div>

  );

}

export default PatientDashboard;