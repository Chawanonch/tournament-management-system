import { Box } from "@mui/joy";
import { AppBar, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logout } from "../store/features/userSlice";
import Alert2 from "./Alert2";
import { routes } from "./Path";

export default function Navbar() {
    const location = useLocation();
    const { token } = useAppSelector((state) => state.user);
    const alert = Alert2()

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const navLinks = [
        { path: routes.home, text: 'หน้าหลัก' },
        { path: routes.tournament, text: 'ทัวร์นาเมนต์' },
        { path: routes.team, text: 'ทีม' },
    ];

    if (token === "") {
        navLinks.push({ path: routes.login, text: 'เข้าสู่ระบบ' });
    } else {
        navLinks.push({ path: "/logout", text: 'ออกจากระบบ' });
    }

    const handleClick = (path: string) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // ตรวจสอบว่าเป็นลิงก์ออกจากระบบหรือไม่
        if (path === "/logout") {
            dispatch(logout()); // เรียก logout
            alert.alertCustom(1, "ออกระบบเสร็จสิ้น")
            navigate(routes.login); // เปลี่ยนไปหน้าแรกหลัง logout
        } else {
            navigate(path); // นำทางไปยังหน้าอื่นๆ
        }
    };

    return (
        <AppBar sx={{ background: "linear-gradient(90deg, rgba(139,144,230,1) 40%, rgba(225,126,122,1) 60%)", minHeight: "100px", width: "100%" }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: '20px', marginTop: "20px", cursor: 'pointer', alignItems: "center" }} onClick={() => navigate(routes.home)}>
                    <img
                        src={"https://i0.wp.com/marketeeronline.co/wp-content/uploads/2019/06/ROV-LOGO.png?fit=900%2C376&ssl=1"}
                        style={{ height: "66px", objectFit: "contain" }}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: 'center' }}>
                        <h4 style={{ fontSize: 36, fontWeight: 'bold', color: "#000" }}>
                            วิทยาการคอมพิวเตอร์
                        </h4>
                        <h4 style={{ fontSize: 20, color: "#555" }}>
                            มหาวิทยาลัยราชภัฏกาญจนบุรี
                        </h4>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: '25px', marginTop: "20px" }}>
                    {
                        navLinks.map((link) => (
                            <h4
                                key={link.path}
                                onClick={() => handleClick(link.path)}
                                style={{
                                    color: location.pathname === link.path ? '#fff' : '#000',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => (e.target as HTMLHeadingElement).style.color = '#E5E7E9'}
                                onMouseOut={(e) => (e.target as HTMLHeadingElement).style.color = location.pathname === link.path ? '#fff' : '#000'}
                            >
                                {link.text}
                            </h4>
                        ))
                    }
                </Box>
            </Toolbar>
        </AppBar>
    )
}
