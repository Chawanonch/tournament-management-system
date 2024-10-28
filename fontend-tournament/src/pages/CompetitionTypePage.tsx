import { Card, Container, Grid } from '@mui/joy';
import NavigateCustom from '../components/NavigateCustom';

export default function CompetitionTypePage() {
    const navigate = NavigateCustom();

    return (
        <Container sx={{ mt: 2 }}> {/* เพิ่ม margin ด้านบน */}
            <Grid container spacing={2}>
                <Grid  xs={12} sm={6}>
                    <Card
                        onClick={() => navigate.navigateToCompete()}
                        sx={{
                            height: '300px', // กำหนดความสูง
                            display: 'flex', // ใช้ Flexbox
                            justifyContent: 'center', // จัดตำแหน่งแนวนอน
                            alignItems: 'center', // จัดตำแหน่งแนวตั้ง
                            cursor: 'pointer', // เปลี่ยน cursor เป็น pointer
                            transition: 'background-color 0.3s, transform 0.3s', // การเปลี่ยนแปลงแบบนุ่มนวล
                            bgcolor: 'transparent', // เริ่มต้นด้วยพื้นหลังโปร่งใส
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.2)', // พื้นหลังโปร่งแสงเมื่อชี้
                                transform: 'scale(1.05)', // ขยายเมื่อชี้
                            },
                            backgroundColor: "#eeeeee"
                        }}
                    >
                        <h2>การแข่งขันทุกประเภท</h2>
                    </Card>
                </Grid>
                <Grid  xs={12} sm={6}>
                    <Card
                        onClick={() => navigate.navigateToTournament()}
                        sx={{
                            height: '300px', // กำหนดความสูง
                            display: 'flex', // ใช้ Flexbox
                            justifyContent: 'center', // จัดตำแหน่งแนวนอน
                            alignItems: 'center', // จัดตำแหน่งแนวตั้ง
                            cursor: 'pointer', // เปลี่ยน cursor เป็น pointer
                            transition: 'background-color 0.3s, transform 0.3s', // การเปลี่ยนแปลงแบบนุ่มนวล
                            bgcolor: 'transparent', // เริ่มต้นด้วยพื้นหลังโปร่งใส
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.2)', // พื้นหลังโปร่งแสงเมื่อชี้
                                transform: 'scale(1.05)', // ขยายเมื่อชี้
                            },
                            backgroundColor: "#eeeeee"
                        }}
                    >
                        <h2>การแข่งขัน ROV ทัวร์นาเมนต์</h2>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
