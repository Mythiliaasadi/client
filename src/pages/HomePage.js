import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./HomePage.css";

const socket = io("http://localhost:5000");

function HomePage() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOP: 0,
    waiting: 0
  });

  const fetchStats = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/api/queue/all"
      );

      const data = await res.json();

      setStats({

        totalOP:
          data.length,

        waiting:
          data.filter(
            q =>
              q.status ===
              "InQueue"
          ).length

      });

    }

    catch (err) {

      console.log(err);

    }

  };



  useEffect(() => {

    fetchStats();

    socket.on(
      "queueUpdated",
      fetchStats
    );

    return () => {

      socket.off(
        "queueUpdated"
      );

    };

  }, []);



  return (

    <div className="home">

      <nav className="navbar">

        <h1 className="logo">

          HealSync

        </h1>

        <button

          className="admin-btn"

          onClick={() =>
            navigate("/admin")
          }

        >

          Admin

        </button>

      </nav>



      <section className="hero">

        <div className="hero-left">

          <div className="welcome-popup">

            ✨ Welcome to HealSync

          </div>

          <h2>

            HealSync

          </h2>

          <p>

            Real Time Patient Queue System

          </p>

          <button

            className="login-btn"

            onClick={() =>
              navigate("/login")
            }

          >

            Login

          </button>

        </div>



        <div className="hero-right">

          <div className="card">

            <span>

              🩺

            </span>

            <h3>

              Total OP

            </h3>

            <h1>

              {stats.totalOP}

            </h1>

            <p>

              Booked Patients

            </p>

          </div>



          <div className="card">

            <span>

              ⏳

            </span>

            <h3>

              Waiting List

            </h3>

            <h1>

              {stats.waiting}

            </h1>

            <p>

              Patients in Queue

            </p>

          </div>

        </div>

      </section>

    </div>

  );

}

export default HomePage;