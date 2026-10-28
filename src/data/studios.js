import { IMG } from "./media";

export const STUDIOS = [
  {
    id: "islington",
    name: "Islington",
    image: IMG.reformerRoom,
    address: "24 Willowbrook Lane, London, AB1 2CD",
    gettingHere: "Angel or Highbury & Islington, 6 min walk",
    rooms: "Reformer room (12) · Tower room (8) · Mat studio (16)",
    facilities: "Showers, lockers, towels, grip socks at reception",
    hours: "Mon–Fri 06:15–21:00 · Sat–Sun 08:00–14:00",
  },
  {
    id: "bristol",
    name: "Bristol",
    image: IMG.matRoom,
    address: "42 Silverstone Road, Bristol, LM5 8NP",
    gettingHere: "Bristol Temple Meads Station, 5 min walk",
    rooms: "Reformer room (12) · Mat studio with garden wall (16)",
    facilities: "Showers, lockers, towel service, bike racks",
    hours: "Mon–Fri 06:15–21:00 · Sat–Sun 08:00–14:00",
  },
];

export const STUDIO_BY_ID = Object.fromEntries(STUDIOS.map((s) => [s.id, s]));
