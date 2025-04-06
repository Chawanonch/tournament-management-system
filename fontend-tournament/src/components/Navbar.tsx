import { Box, Drawer, List, ListItemButton, ModalClose } from "@mui/joy";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logout } from "../store/features/userSlice";
import Alert2 from "./Alert2";
import { routes } from "./Path";
import MenuIcon from '@mui/icons-material/Menu';
import { windowSizes } from "./Reuse";
import { useState } from "react";

export default function Navbar() {
    const location = useLocation();
    const { token } = useAppSelector((state) => state.user);
    const alert = Alert2()
    const [openMenu, setOpenMenu] = useState(false);

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const windowSize = windowSizes();

    const navLinks = [
        { path: routes.home, text: 'หน้าหลัก' },
        { path: routes.competition, text: 'รายละเอียดการแข่งขัน' },
        { path: routes.competitionType, text: 'ลงทะเบียนการแข่งขัน' },
        { path: routes.certificate, text: 'รางวัล' },
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
        <AppBar sx={{ backgroundColor: "#68b1ff", height: "120px", width: "100%" }}>
            {windowSize < 1183 ?
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: '20px', marginTop: "20px", cursor: 'pointer', alignItems: "flex-start" }} onClick={() => navigate(routes.home)}>
                        <img src={`${routes.home}kru.png`} alt="icon" style={{ width: 75 }} />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "0px", textAlign: 'left' }}>
                            <h4 style={{ fontSize: windowSize < 720 ? 20 : 36, fontWeight: 'bold', color: "#000", fontFamily: 'Kanit, sans-serif' }}>
                                การแข่งขันงานสัปดาห์วิทยาศาสตร์
                            </h4>
                            <h4 style={{ fontSize: windowSize < 720 ? 12 : 20, color: "#000", fontFamily: 'Kanit, sans-serif' }}>
                                สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยราชภัฏกาญจนบุรี
                            </h4>
                        </Box>
                    </Box>
                    <IconButton onClick={() => setOpenMenu(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer open={openMenu} anchor="right" onClose={() => setOpenMenu(false)}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                ml: 1,
                                mt: 1,
                                mr: 2,
                            }}
                        >
                            <ModalClose id="close-icon" sx={{ position: 'initial' }} />
                            <h4
                            >
                                ปิด
                            </h4>
                        </Box>
                        <List
                            size="lg"
                            component="nav"
                            sx={{
                                flex: 'none',
                                fontSize: 'xl',
                                '& > div': { justifyContent: 'center' },
                            }}
                        >
                            {
                                navLinks.map((link) => (
                                    <ListItemButton key={link.path} onClick={() => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        handleClick(link.path)
                                    }}
                                        style={{
                                            color: location.pathname === link.path ? '#000' : '#8E8B8B',
                                            cursor: 'pointer'
                                        }}
                                    ><h4>{link.text}</h4></ListItemButton>
                                ))
                            }
                        </List>
                    </Drawer>
                </Toolbar>
                :
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: '20px', marginTop: "20px", cursor: 'pointer', alignItems: "flex-start" }} onClick={() => navigate(routes.home)}>
                        <img src={`${routes.home}kru.png`} alt="icon" style={{ width: 75 }} />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "0px", textAlign: 'left' }}>
                            <h4 style={{ fontSize: 36, fontWeight: 'bold', color: "#000", fontFamily: 'Kanit, sans-serif' }}>
                                การแข่งขันงานสัปดาห์วิทยาศาสตร์
                            </h4>
                            <h4 style={{ fontSize: 20, color: "#000", fontFamily: 'Kanit, sans-serif' }}>
                                สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยราชภัฏกาญจนบุรี
                            </h4>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: '25px', marginTop: "20px" }}>
                        {navLinks.map((link) => (
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
            }
        </AppBar>
    )
}
