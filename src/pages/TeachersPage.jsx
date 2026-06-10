import { Eyebrow, Title, Subtitle } from "../components/ui";
import TeacherCard from "../components/sections/TeacherCard";
import TEACHERS from "../data/teachers";

export default function TeachersPage({ onBook }) {
  return (
    <div className="page" style={{ paddingTop:40, paddingBottom:16 }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <Eyebrow>Our Team</Eyebrow>
        <Title center size={38}>Meet the Teachers</Title>
        <Subtitle center>Friendly, certified, and fully dedicated — each brings something unique to every lesson.</Subtitle>
      </div>
      {TEACHERS.map(t => <TeacherCard key={t.id} t={t} onBook={onBook} />)}
    </div>
  );
}
