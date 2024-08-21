import { Container } from "@mui/joy";
import { routes } from "../components/Path";

export default function HomePage() {

  return (
    <div style={{marginTop:-20}}>
      <img 
        src={`${routes.home}FTlUny0VUAAglxT.jpg`} 

        alt="ROV Tournament" 
        style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
      />
      <Container>
        <p>
          ทัวร์นาเมนต์ ROV เป็นการแข่งขันระหว่างทีมที่มีผู้เล่น 5 คน โดยแต่ละทีมต้องพยายามยึดป้อมของฝ่ายตรงข้ามเพื่อชนะในการแข่งขันนี้
          โดยมีการจัดการแข่งขันขึ้นเพื่อเฟ้นหาทีมที่แข็งแกร่งที่สุด ซึ่งในแต่ละรอบจะมีการจัดคู่แข่งเพื่อหาทีมที่ดีที่สุดเข้าสู่รอบต่อไป
          หากคุณพร้อมแล้ว มาเข้าร่วมการแข่งขันนี้และเป็นสุดยอดทีม ROV กันเถอะ!
        </p>
      </Container>
    </div>
  );
}
