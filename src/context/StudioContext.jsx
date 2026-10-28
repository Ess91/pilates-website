import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { bookingService } from "../services/bookingService";

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [account, setAccount] = useState({ credits: 0, unlimited: false, bookings: {} });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [panel, setPanel] = useState(null); // { type: "book" | "confirmed" | "bookings", sessionId? }
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  const apply = ({ sessions, account }) => {
    setSessions(sessions);
    setAccount(account);
  };

  useEffect(() => {
    bookingService.load().then((data) => {
      apply(data);
      setLoading(false);
    });
  }, []);

  const closePanel = useCallback(() => setPanel(null), []);

  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  // Wraps a service call: sets busy, applies the result, surfaces errors as a toast.
  const run = useCallback(
    async (fn) => {
      setBusy(true);
      try {
        apply(await fn());
        return true;
      } catch (err) {
        showToast(err.message || "Something went wrong. Please try again.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [showToast]
  );

  const value = useMemo(() => {
    const now = new Date();
    const byId = Object.fromEntries(sessions.map((s) => [s.id, s]));
    const isPast = (s) => s.start <= now;
    const spotsLeft = (s) => s.capacity - s.takenSpots.length;
    const upcoming = (limit = Infinity, filter = () => true) =>
      sessions.filter((s) => !isPast(s) && filter(s)).slice(0, limit);

    return {
      loading,
      busy,
      sessions,
      sessionById: (id) => byId[id],
      account,
      bookingFor: (id) => account.bookings[id],
      bookingCount: Object.keys(account.bookings).length,
      isPast,
      spotsLeft,
      upcoming,
      firstDayWith: (filter) => upcoming(1, filter)[0]?.dayIndex ?? 0,

      panel,
      openBooking: (sessionId) => setPanel({ type: "book", sessionId }),
      openMyBookings: () => setPanel({ type: "bookings" }),
      closePanel,

      toast,
      showToast,

      book: async (sessionId, spot, payment) => {
        if (await run(() => bookingService.book(sessionId, { spot, payment })))
          setPanel({ type: "confirmed", sessionId });
      },
      joinWaitlist: async (sessionId) => {
        if (await run(() => bookingService.joinWaitlist(sessionId))) setPanel({ type: "confirmed", sessionId });
      },
      cancel: async (sessionId) => {
        if (await run(() => bookingService.cancel(sessionId))) showToast("Booking cancelled");
      },
      purchase: async (plan) => {
        if (await run(() => bookingService.purchase(plan.id)))
          showToast(
            plan.unlimited
              ? "Unlimited membership active. No payment taken in this demo."
              : `${plan.credits} credit${plan.credits > 1 ? "s" : ""} added. No payment taken in this demo.`
          );
      },
    };
  }, [sessions, account, loading, busy, panel, toast, run, showToast, closePanel]);

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside <StudioProvider>");
  return ctx;
}
