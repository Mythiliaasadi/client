import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

function Dashboard() {
  const [form, setForm] = useState({
    patientName: "",
    doctor: "",
    department: "",
    date: ""
  });

  const [queues, setQueues] = useState([]);
  const [notification, setNotification] = useState("");

  // Fetch Queue List
  const fetchQueues = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/queue/all"
    );

    setQueues(res.data);
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  // Book OP
  const addQueue = async () => {
    if (!form.patientName) {
      alert("Enter Patient Name");
      return;
    }

    const res = await axios.post(
      "http://localhost:5000/api/queue/add",
      form
    );

    setNotification(
      `OP Token ${res.data.tokenNumber} Booked Successfully`
    );

    setForm({
      patientName: "",
      doctor: "",
      department: "",
      date: ""
    });

    fetchQueues();
  };

  // Complete Queue
  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/queue/update/${id}`,
      {
        status
      }
    );

    setNotification("Patient Completed");

    fetchQueues();
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>Hospital OP Queue System</h1>

      {/* Notification */}
      {notification && (
        <div
          style={{
            backgroundColor: "lightgreen",
            padding: "10px",
            marginBottom: "20px"
          }}
        >
          {notification}
        </div>
      )}

      {/* Patient Form */}
      <input
        type="text"
        placeholder="Patient Name"
        value={form.patientName}
        onChange={(e) =>
          setForm({
            ...form,
            patientName: e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Doctor Name"
        value={form.doctor}
        onChange={(e) =>
          setForm({
            ...form,
            doctor: e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Department"
        value={form.department}
        onChange={(e) =>
          setForm({
            ...form,
            department: e.target.value
          })
        }
      />

      <br /><br />

      <input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm({
            ...form,
            date: e.target.value
          })
        }
      />

      <br /><br />

      <button onClick={addQueue}>
        Book OP
      </button>

      <hr />

      {/* Queue List */}
      {queues.map((q) => (
        <div
          key={q._id}
          style={{
            border: "1px solid black",
            padding: "15px",
            marginBottom: "20px"
          }}
        >
          <h3>Token: {q.tokenNumber}</h3>

          <p>Patient: {q.patientName}</p>

          <p>Doctor: {q.doctor}</p>

          <p>Department: {q.department}</p>

          <p>Date: {q.date}</p>

          <p>Status: {q.status}</p>

          {/* QR CODE */}
          <QRCodeCanvas
            value={`Token:${q.tokenNumber} Patient:${q.patientName}`}
            size={120}
          />

          <br /><br />

          <button
            onClick={() =>
              updateStatus(q._id, "Completed")
            }
          >
            Complete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;