import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useStudio } from "./context/StudioContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Panels, { Toast } from "./components/Panels";
import Home from "./pages/Home";
import Classes from "./pages/Classes";
import Timetable from "./pages/Timetable";
import Teachers from "./pages/Teachers";
import TeacherProfile from "./pages/TeacherProfile";
import Studios from "./pages/Studios";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const TITLES = {
  "/": "Pilates Studio",
  "/classes": "Classes · Pilates",
  "/timetable": "Timetable · Pilates",
  "/teachers": "Teachers · Pilates",
  "/studios": "Studios · Pilates",
  "/pricing": "Pricing · Pilates",
};

function RouteEffects() {
  const { pathname } = useLocation();
  const { closePanel } = useStudio();
  useEffect(() => {
    window.scrollTo(0, 0);
    closePanel();
    document.title = TITLES[pathname] || " Pilates Studio";
  }, [pathname, closePanel]);
  return null;
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />
          <Route path="/studios" element={<Studios />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Panels />
      <Toast />
    </>
  );
}
