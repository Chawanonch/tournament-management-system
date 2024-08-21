import { baseUrlServer } from "./api/agent";

// const baseUrl = "/";
const baseUrl = baseUrlServer;

export const routes = {
    home: baseUrl,
    tournament: baseUrl + "tournament",
    tournamentId: baseUrl + "tournament" + "/:id",
    announce: baseUrl + "announce",
    team: baseUrl + "team",
    login: baseUrl + "login",
    register: baseUrl + "register",
    error: baseUrl + "*",
};
