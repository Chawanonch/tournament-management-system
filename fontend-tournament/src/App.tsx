import './App.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TournamentPage from './pages/TournamentPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TeamsPage from './pages/TeamPage'
import Footer from './components/Footer'
import TournamentDetailPage from './pages/TournamentDetailPage'
import { getTournament } from './store/features/tournamentSlice'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/store'
import { getTeamByUser, getTeams } from './store/features/teamSlice'
import { getLevel } from './store/features/levelSlice'
import { checkExpToken, getByUser, getUserAdmin, logout } from './store/features/userSlice'
import { getRegistration } from './store/features/registrationSlice'
import { getMatch } from './store/features/matchSlice'
import { routes } from './components/Path'
import AnnouncePage from './pages/AnnouncePage'

function App() {
  const { token } = useAppSelector((state) => state.user); // สมมติว่ามีทัวร์นาเมนต์หลายรายการ

  const dispatch = useAppDispatch()

  const fetchNoToken = async () => {
    await dispatch(getUserAdmin());
    await dispatch(getTournament());
    await dispatch(getRegistration());
    await dispatch(getTeams());
    await dispatch(getLevel());
    await dispatch(getMatch());
  }

  const fetchToken = async () => {
    await dispatch(getByUser());
    await dispatch(getTeamByUser());
  }

  useEffect(() => {
    const fetchData = async () => {
      fetchNoToken()
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (token !== "") {
        const isTokenValid = await dispatch(checkExpToken(token));

        if (isTokenValid.payload === false) {
          fetchToken();
        } else {
          await dispatch(logout());
        }
      }
    };

    fetchData();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ marginTop: 120 }}>
        <Routes>
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.tournament} element={<TournamentPage />} />
          <Route path={routes.tournamentId} element={<TournamentDetailPage />} />
          <Route path={routes.announce} element={<AnnouncePage />} />
          <Route path={routes.team} element={<TeamsPage />} />
          {token === "" &&
            <Route path={routes.login} element={<LoginPage />} />
          }
          {token === "" &&
            <Route path={routes.register} element={<RegisterPage />} />
          }
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  )
}

export default App
