export const ANNOUNCEMENT = {
  text: "New here? Your first 3 classes for £55.",
  linkText: "Claim the intro offer",
  to: "/pricing",
};

export const DROP_IN_PRICE = 32;

export const PLANS = [
  { id: "intro", name: "Intro offer", price: 55, unit: "3 classes", credits: 3, featured: true,
    lines: ["First-time clients only", "Use within 14 days", "Any class, either studio"] },
  { id: "drop", name: "Drop-in", price: DROP_IN_PRICE, unit: "per class", credits: 1,
    lines: ["Book up to 7 days ahead", "Free cancellation 12h before"] },
  { id: "five", name: "5-class pack", price: 150, unit: "£30 a class", credits: 5,
    lines: ["Valid 3 months", "Share with one friend"] },
  { id: "ten", name: "10-class pack", price: 280, unit: "£28 a class", credits: 10,
    lines: ["Valid 6 months", "Priority waitlist"] },
  { id: "unlimited", name: "Unlimited", price: 249, unit: "per month", credits: 0, unlimited: true,
    lines: ["Up to 2 classes a day", "Book 14 days ahead", "Freeze up to 2 months a year"] },
];

export const FAQS = [
  { q: "I've never done Pilates. Where do I start?",
    a: "Book Reformer Foundations. It is built for first-timers and covers how the springs, straps and footbar work. Most people move on to a blue class after three or four sessions." },
  { q: "What should I wear?",
    a: "Fitted clothing so your teacher can see your alignment, and grip socks. Bring your own or buy a pair at reception for £12." },
  { q: "How early should I arrive?",
    a: "Ten minutes before your first class, so we can set up your reformer and ask about any injuries. Five minutes after that." },
  { q: "Can I cancel?",
    a: "Yes. Cancel up to 12 hours before class and your credit goes back to your account. Later than that and the credit is used." },
  { q: "Is it safe in pregnancy?",
    a: "Priya runs private pre and postnatal sessions. Talk to us before booking a group class after your first trimester." },
];
