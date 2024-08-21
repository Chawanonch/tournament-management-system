import axios, { AxiosResponse } from "axios";
import { store } from "../../store/store";

// export const baseUrl = "https://localhost:7093/";
export const baseUrlServer = "/cs64/s09/tournament-rov/";

axios.defaults.baseURL = baseUrlServer;

export const folderImage = baseUrlServer + "images/";

const responseBody = (response: AxiosResponse) => response.data;

//เช็ค token
axios.interceptors.request.use((config) => {
  const token = store.getState().user.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, data: FormData) =>
    axios
      .post(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  putForm: (url: string, data: FormData) =>
    axios
      .put(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  deleteForm: <T>(url: string, data?: T) =>
    axios.delete(url, { data }).then(responseBody),
};

function createFormData(item: any, images?: Array<string | File>) {
  const formData = new FormData();
  for (const key in item) {
    formData.append(key, item[key]);
  }
  if (images) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return formData;
}

const User = {
  loginUser: (values: object) => requests.post("api/Authen/Login", values),
  getByUser: () => requests.get("api/Authen/GetUserDetail"),
  getUserAdmin: () => requests.get("api/Authen/GetUsers"),
  getRoles: () => requests.get("api/Authen/GetRoles"),
  registerUser: (values: object) =>
    requests.post("api/Authen/Register", values),
  removeUser: (id: number) => requests.delete(`api/Authen/RemoveUser?id=${id}`),
  checkExpToken: (token: string) =>
    requests.get(`api/Authen/IsTokenExpired?token=${token}`),
};

const Levels = {
  getLevels: () => requests.get("api/Levels/GetLevel"),
  creatAndUpdateLevel: (values: object) =>
    requests.postForm("api/Levels/CAULevel", createFormData(values)),
  removeLevel: (id: number) =>
    requests.delete(`api/Levels/RemoveLevel?id=${id}`),
};

const Matchs = {
  getMatchs: () => requests.get("api/Matchs/GetMatch"),
  randomMatchs: (values:object) =>
    requests.post("api/Matchs/RandomMatch", values),
  updateMatch: (values:object) =>
    requests.post("api/Matchs/UpdateMatch", values),
  removeMatch: (id: number) =>
    requests.delete(`api/Matchs/RemoveMatch?id=${id}`),
  resetTeamsAndDeleteMatches: (id: number) =>
    requests.get(`api/Matchs/ResetTeamsAndDeleteMatches?id=${id}`),
};

const Registrations = {
  getRegistrations: () => requests.get("api/Registrations/GetRegistrations"),
  registrations: (values: object) =>
    requests.post("api/Registrations/Registration", values),
  checkInRegistration: (id: number) =>
    requests.get(`api/Registrations/CheckInRegistrations?id=${id}`),
  checkInAllRegistrations: (id: number) =>
    requests.get(`api/Registrations/CheckInAllRegistrations?id=${id}`),
  cancelCheckInAllRegistrations: (id: number) =>
    requests.get(`api/Registrations/CancelCheckInAllRegistrations?id=${id}`),
  removeRegistration: (id: number) =>
    requests.delete(`api/Registrations/RemoveRegistration?id=${id}`),
};

const Teams = {
  getTeams: () => requests.get("api/Teams/GetTeam"),
  getTeamByUser: () => requests.get("api/Teams/GetTeamByUser"),
  creatAndUpdateTeam: (values: object) =>
    requests.post("api/Teams/CAUTeam", values),
  removeTeam: (id: number) => requests.delete(`api/Teams/RemoveTeam?id=${id}`),
};

const Tournaments = {
  getTournaments: () => requests.get("api/Tournaments/GetTournament"),
  creatAndUpdateTournament: (values: object) =>
    requests.post("api/Tournaments/CAUTournament", values),
  statusHideTournament: (id: number) =>
    requests.get(`api/Tournaments/StatusHideTournament?id=${id}`),
  removeTournament: (id: number) =>
    requests.delete(`api/Tournaments/RemoveTournament?id=${id}`),
};

const agent = {
  User,
  Levels,
  Matchs,
  Registrations,
  Teams,
  Tournaments,
};

export default agent;
