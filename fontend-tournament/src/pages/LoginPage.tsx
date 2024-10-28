import { Button, Container, Input, Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/store";
import { getByUser, getUserAdmin, loginUser } from "../store/features/userSlice";
import { getTeamByUser } from "../store/features/teamSlice";
import NavigateCustom from "../components/NavigateCustom";
import Alert2 from "../components/Alert2";

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch()
  const navigate = NavigateCustom()
  const alert = Alert2()

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getUserAdmin());
    };

    fetchData();
  }, [dispatch]);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      alert.alertCustom(3, "กรุณาป้อนข้อมูลให้ครบ!")
      return;
    }

    const item = await dispatch(loginUser({ emailOrUsername, password }))

    if (item.payload !== "" && item.payload !== undefined) {
      alert.alertCustom(1, "กำลังเข้าสู่ระบบ!")

      setTimeout(async () => {
        await dispatch(getByUser());
        await dispatch(getTeamByUser());
        navigate.navigateToHome();
      }, 900);
    }
    else {
      alert.alertCustom(2, "ป้อนข้อมูลผิดพลาด!")
    }
  };

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
        <h1 style={{ textAlign: "center" }}>
          เข้าสู่ระบบ
        </h1>

        <Input
          type="email"
          placeholder="อีเมล"
          sx={{ marginBottom: "1rem" }}
          value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="รหัสผ่าน"
          sx={{ marginBottom: "1rem" }}
          value={password} onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="solid" color="primary" fullWidth onClick={handleLogin}>
          <h4>
            ล็อคอิน
          </h4>
        </Button>

        <h4>
          ยังไม่มีบัญชี?{" "}
          <Button onClick={navigate.navigateToRegister} variant="outlined">
            <h4>
              สมัครสมาชิก
            </h4>
          </Button>
        </h4>
      </Stack>
    </Container>
  );
}
