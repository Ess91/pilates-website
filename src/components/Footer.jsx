import { useState } from "react";
import { Link } from "react-router-dom";
import { STUDIOS } from "../data/studios";
import { useStudio } from "../context/StudioContext";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { showToast } = useStudio();

  const subscribe = (e) => {
    e.preventDefault();
    setEmail("");
    showToast("Thanks. You're on the list.");
  };

  return (
    <footer className="site">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <h4>Stay in the loop</h4>
            <p className="muted narrow">New classes, teacher workshops and the odd free session. One email a month.</p>
            <form className="news" onSubmit={subscribe}>
              <input
                id="newsEmail"
                type="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn solid sm" type="submit">
                Subscribe
              </button>
            </form>
          </div>
          <div>
            <h4>Studio</h4>
            <ul>
              <li><Link to="/classes">Classes</Link></li>
              <li><Link to="/timetable">Timetable</Link></li>
              <li><Link to="/teachers">Teachers</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>
          {STUDIOS.map((s) => {
            const [street, ...rest] = s.address.split(", ");
            return (
              <div key={s.id}>
                <h4>{s.name}</h4>
                <ul>
                  <li>{street}</li>
                  <li>{rest.join(", ")}</li>
                  <li className="muted">{s.gettingHere}</li>
                </ul>
              </div>
            );
          })}
        </div>
        <div className="bigmark" aria-hidden="true">PILATES</div>
        <div className="legal">
          <span>© {new Date().getFullYear()} Pilates Studios. Fictional studio, design case study. Designed & Built by <a href="www.estherboateng.co.uk" target="_blank">Esther Boateng</a></span>
          <span>hello@pilates.studio · 020 1234 5678</span>
        </div>
      </div>
    </footer>
  );
}
