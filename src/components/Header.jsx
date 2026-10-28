import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ANNOUNCEMENT } from "../data/content";
import { useStudio } from "../context/StudioContext";
import "./Header.css";

const NAV = [
  { to: "/classes", label: "Classes" },
  { to: "/timetable", label: "Timetable" },
  { to: "/teachers", label: "Teachers" },
  { to: "/studios", label: "Studios" },
  { to: "/pricing", label: "Pricing" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { openMyBookings, bookingCount } = useStudio();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="announce">
        <div className="wrap">
          {ANNOUNCEMENT.text} <Link to={ANNOUNCEMENT.to}>{ANNOUNCEMENT.linkText}</Link>
        </div>
      </div>
      <header className="top">
        <div className="wrap">
          <Link className="logo" to="/" aria-label="Pilates home">
            Pilates
          </Link>
          <button className="menu-btn" aria-expanded={open} aria-controls="mainNav" onClick={() => setOpen(!open)}>
            {open ? "Close" : "Menu"}
          </button>
          <nav className={`main${open ? " open" : ""}`} id="mainNav" aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}>
                {n.label}
              </NavLink>
            ))}
            <button className="mb-mobile" onClick={openMyBookings}>
              My bookings{bookingCount ? ` (${bookingCount})` : ""}
            </button>
          </nav>
          <div className="acct">
            <button className="mb" onClick={openMyBookings}>
              My bookings{bookingCount ? ` (${bookingCount})` : ""}
            </button>
            <Link className="btn solid sm" to="/timetable">
              Book now
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
