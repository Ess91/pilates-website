/*
 * Booking service: the only place the app talks to a "backend".
 *
 * Right now it is a mock that keeps the account in localStorage, so the site works with no server.
 * To connect a real studio platform (Mindbody, bsport, Mariana Tek, TeamUp, Momence...), keep these
 * function names and return shapes and replace the bodies with API calls. Nothing else needs to change.
 *
 * Shapes
 *   Session  { id, start: Date, dayIndex, classId, teacherId, studioId, capacity, takenSpots: number[], waitlistCount }
 *   Booking  { sessionId, spot?, payment: "credit" | "drop-in", waitlist?: boolean, position? }
 *   Account  { credits: number, unlimited: boolean, bookings: Record<sessionId, Booking> }
 */
import { generateWeek } from "./mockSchedule";
import { PLANS } from "../data/content";

const STORAGE_KEY = "pilates.account.v1";
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

function loadAccount() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { credits: 0, unlimited: false, bookings: {}, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable */
  }
  return { credits: 0, unlimited: false, bookings: {} };
}

function saveAccount(account) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  } catch {
    /* storage unavailable */
  }
}

let sessions = null;
let account = loadAccount();

function ensureSessions() {
  if (sessions) return;
  sessions = generateWeek(7);
  const ids = new Set(sessions.map((s) => s.id));
  // Drop bookings for classes no longer on the timetable, and mark the user's spots as taken.
  for (const id of Object.keys(account.bookings)) {
    if (!ids.has(id)) delete account.bookings[id];
  }
  for (const s of sessions) {
    const b = account.bookings[s.id];
    if (b && !b.waitlist && !s.takenSpots.includes(b.spot)) s.takenSpots.push(b.spot);
  }
  saveAccount(account);
}

const snapshot = () => ({
  sessions: sessions.map((s) => ({ ...s, takenSpots: [...s.takenSpots] })),
  account: structuredClone(account),
});

class BookingError extends Error {}

export const bookingService = {
  async load() {
    ensureSessions();
    await delay(150);
    return snapshot();
  },

  async book(sessionId, { spot, payment }) {
    ensureSessions();
    await delay();
    const s = sessions.find((x) => x.id === sessionId);
    if (!s) throw new BookingError("That class is no longer on the timetable.");
    if (account.bookings[sessionId]) throw new BookingError("You're already booked on this class.");
    if (s.takenSpots.includes(spot)) throw new BookingError("Someone just took that spot. Please choose another.");
    if (payment === "credit" && !account.unlimited) {
      if (account.credits <= 0) throw new BookingError("You have no credits left. Choose drop-in or buy a pack.");
      account.credits -= 1;
    }
    s.takenSpots.push(spot);
    account.bookings[sessionId] = { sessionId, spot, payment };
    saveAccount(account);
    return snapshot();
  },

  async joinWaitlist(sessionId) {
    ensureSessions();
    await delay();
    const s = sessions.find((x) => x.id === sessionId);
    if (!s) throw new BookingError("That class is no longer on the timetable.");
    s.waitlistCount += 1;
    account.bookings[sessionId] = { sessionId, payment: "credit", waitlist: true, position: s.waitlistCount };
    saveAccount(account);
    return snapshot();
  },

  async cancel(sessionId) {
    ensureSessions();
    await delay();
    const b = account.bookings[sessionId];
    const s = sessions.find((x) => x.id === sessionId);
    if (!b) return snapshot();
    if (s) {
      if (b.waitlist) s.waitlistCount = Math.max(0, s.waitlistCount - 1);
      else s.takenSpots = s.takenSpots.filter((n) => n !== b.spot);
    }
    if (!b.waitlist && b.payment === "credit" && !account.unlimited) account.credits += 1;
    delete account.bookings[sessionId];
    saveAccount(account);
    return snapshot();
  },

  async purchase(planId) {
    ensureSessions();
    await delay();
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) throw new BookingError("That plan isn't available.");
    if (plan.unlimited) account.unlimited = true;
    else account.credits += plan.credits;
    saveAccount(account);
    return snapshot();
  },
};
