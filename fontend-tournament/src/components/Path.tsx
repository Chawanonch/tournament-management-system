import { baseUrlServer } from "./api/agent";

// const baseUrl = "/";
const baseUrl = baseUrlServer;

export const routes = {
    home: baseUrl,
    competition: baseUrl + "competition",
    competitionType: baseUrl + "competitionType",
    compete: baseUrl + "compete",
    competeId: baseUrl + "compete" + "/:id",
    tournament: baseUrl + "tournament",
    tournamentId: baseUrl + "tournament" + "/:id",
    announce: baseUrl + "announce",
    certificate: baseUrl + "certificate",
    team: baseUrl + "team",
    login: baseUrl + "login",
    register: baseUrl + "register",
    error: baseUrl + "*",
};
