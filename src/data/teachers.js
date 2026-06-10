import C from "../styles/theme";

const TEACHERS = [
  {
    id: 1,
    name: "Teacher Yarrah",
    img: "yarrah",
    role: "ESL Instructor",
    accent: C.gold,
    accentRgb: "245,166,35",
    specs: ["Conversation", "Grammar", "All Levels", "Kids & Adults"],
    bio: "Teacher Yarrah is a warm and enthusiastic ESL instructor known for her patient approach and clear explanations. She creates a safe, encouraging space where every student feels ready to speak — nervous beginners and confident intermediates alike.",
    certs: ["ESL Certified Instructor", "Online Teaching Specialist", "Triangle ESL Faculty"],
    testimonials: [
      { text: "I was so scared to speak English but Teacher Yarrah made me feel comfortable right away. Now I look forward to every class!", author: "Student · Triangle ESL" },
      { text: "She explains grammar so clearly and always finds fun ways to practice. I improved so fast!", author: "Student · Triangle ESL" },
    ],
  },
  {
    id: 2,
    name: "Teacher Wia",
    img: "wia",
    role: "ESL Instructor",
    accent: C.teal,
    accentRgb: "58,191,177",
    specs: ["Business English", "Pronunciation", "Adult Learners", "Professional Skills"],
    bio: "Teacher Wia brings professionalism and warmth to every class. Specializing in adult learners, she builds real-world communication skills that open doors at work and in life. Her pronunciation coaching is especially popular.",
    certs: ["ESL Certified Instructor", "Business English Specialist", "Pronunciation Coach", "Triangle ESL Faculty"],
    testimonials: [
      { text: "Teacher Wia completely transformed how I present at work. My English confidence is night and day!", author: "Student · Triangle ESL" },
      { text: "Her pronunciation tips are so practical. I use them every day. Highly recommend!", author: "Student · Triangle ESL" },
    ],
  },
  {
    id: 3,
    name: "Teacher Vithyanne",
    img: "vithyanne",
    role: "ESL Instructor",
    accent: C.pink,
    accentRgb: "240,98,146",
    specs: ["Fun & Creative", "Young Learners", "Storytelling", "Interactive Games"],
    bio: "Teacher Vithyanne brings energy, creativity, and pure joy into every lesson! She is especially beloved by younger students — her game-based, story-driven style makes English feel like an adventure, not a chore.",
    certs: ["ESL Certified Instructor", "Young Learners Specialist", "Play-Based Learning Certificate", "Triangle ESL Faculty"],
    testimonials: [
      { text: "My child used to dread English class. Now she asks to study extra! Teacher Vithyanne is amazing.", author: "Parent · Triangle ESL" },
      { text: "So creative and energetic. My son loves every single lesson.", author: "Parent · Triangle ESL" },
    ],
  },
];

export default TEACHERS;