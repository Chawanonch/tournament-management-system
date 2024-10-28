import { useNavigate } from "react-router-dom"
import { routes } from "./Path"

export default function NavigateCustom() {
    const navigate = useNavigate()
    const navigateToHome = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(routes.home)
    }
    const navigateToTournament = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(routes.tournament)
    }
    const navigateToTournamentDetail = (id: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(`${routes.tournament}/${id}`)
    }
    const navigateToCompete = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(routes.compete)
    }
    const navigateToCompeteDetail = (id: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(`${routes.compete}/${id}`)
    }
    const navigateToAnnounce = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(routes.announce)
    }
    const navigateToTeam = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(routes.team)
    }
    const navigateToLogin = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(routes.login)
    }
    const navigateToRegister = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(routes.register)
    }

    return {
        navigateToHome,
        navigateToTournament,
        navigateToTournamentDetail,
        navigateToTeam,
        navigateToLogin,
        navigateToRegister,
        navigateToCompete,
        navigateToCompeteDetail,
        navigateToAnnounce
    }
}
