import { Button, Container, Input, Stack, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import Alert2 from "../components/Alert2";
import NavigateCustom from "../components/NavigateCustom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { isValidEmail } from "../components/Reuse";
import { registerUser } from "../store/features/userSlice";

export default function RegisterPage() {
  const { users } = useAppSelector((state) => state.user);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [roleId, setRoleId] = useState<number>(0);

  const dispatch = useAppDispatch()
  const navigate = NavigateCustom()
  const alert = Alert2()

  useEffect(() => {
    if (users && users.length > 0) {
      const isAdmin = users.filter((user: any) => user.roleId === 1);
      setRoleId(isAdmin.length > 0 ? 2 : 1);
    }
  }, [users]);
  
  const funRegister = async () => {
    if (!username) {
      alert.alertCustom(3,"กรุณาป้อนชื่อผู้ใช้!")
      return;
    }
    
    if (!isValidEmail(email)) {
      alert.alertCustom(3,"กรุณาป้อนรูปแบบอีเมลให้ถูกต้อง !")
      return;
    }

    if (password.length < 6) {
      alert.alertCustom(3,"กรุณาป้อนรหัสไม่ต่ำกว่า 6 ตัว !")
      return;
    }

    const item = await dispatch(registerUser({ username, email, password, roleId }))
    
    if (item.payload !== "" && item.payload !== undefined && item.payload !== null) {
      alert.alertCustom(1,"สร้างบัญชีผู้ใช้สำเร็จ !")
      setTimeout(() => {
        navigate.navigateToLogin();
      }, 900);
    }
    else alert.alertCustom(2,"กรุณาลองใหม่!")
  }

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          boxShadow: "md",
          borderRadius: "md",
        }}
      >
        <Typography level="h1" component="h1" sx={{ textAlign: "center" }}>
          สมัครสมาชิก
        </Typography>

        <Input
          type="text"
          placeholder="ชื่อผู้ใช้"
          sx={{ marginBottom: "1rem" }}
          value={username} onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="อีเมล"
          sx={{ marginBottom: "1rem" }}
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="รหัสผ่าน"
          sx={{ marginBottom: "1rem" }}
          value={password} onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="solid" color="primary" fullWidth onClick={funRegister}>
          สมัครสมาชิก
        </Button>

        <Button onClick={navigate.navigateToLogin} variant="outlined">
          กลับ
        </Button>
      </Stack>
    </Container>
  )
}
