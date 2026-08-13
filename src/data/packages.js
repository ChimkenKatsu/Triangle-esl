import C from "../styles/theme";

const PACKAGES = [
  {
    id:       "single",
    label:    "Single Class",
    sessions: 1,
    price:    2,
    icon:     "🎯",
    badge:    null,
    per:      null,
    color:    C.teal,
    rgb:      "58,191,177",
    note:     null,
  },
  {
    id:       "starter",
    label:    "15 Classes",
    sessions: 15,
    bonusSessions: 2,
    price:    39.99,
    icon:     "⭐",
    badge:    "POPULAR",
    per:      "$2.67",
    color:    C.gold,
    rgb:      "245,166,35",
    note:     "Includes 2 FREE classes",
  },
  {
    id:       "pro",
    label:    "30 Classes",
    sessions: 30,
    bonusSessions: 5,
    price:    69.99,
    icon:     "🚀",
    badge:    "BEST VALUE",
    per:      "$2.33",
    color:    C.purple,
    rgb:      "124,58,237",
    note:     "Includes 5 FREE classes",
  },
];

export default PACKAGES;