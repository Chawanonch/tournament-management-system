import axios, { AxiosResponse } from "axios";
import { store } from "../../store/store";

// export const baseUrl = "https://localhost:7093/";
// export const baseUrlServer = "/cs64/s09/tournament-rov/";
export const baseUrlServer = "/rov/";

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

  Object.keys(item).forEach((key) => {
    if (item[key] !== undefined && item[key] !== null) {
      if (Array.isArray(item[key])) {
        formData.append(key, JSON.stringify(item[key]));
      } else {
        formData.append(key, item[key]);
      }
    }
  });
  
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
  resetMatchesForRound: (values:object) =>
    requests.post("api/Matchs/ResetMatchesForRound", values),
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

  getRegistrationCompetes: () => requests.get("api/Registrations/GetRegistrationCompetes"),
  registrationCompetes: (values: object) =>
    requests.post("api/Registrations/RegistrationCompete", values),
  checkInRegistrationCompete: (id: number) =>
    requests.get(`api/Registrations/CheckInRegistrationCompetes?id=${id}`),
  checkInAllRegistrationCompetes: (id: number) =>
    requests.get(`api/Registrations/CheckInAllRegistrationCompetes?id=${id}`),
  cancelCheckInAllRegistrationCompetes: (id: number) =>
    requests.get(`api/Registrations/CancelCheckInAllRegistrationCompetes?id=${id}`),
  removeRegistrationCompete: (id: number) =>
    requests.delete(`api/Registrations/RemoveRegistrationCompete?id=${id}`),
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
  creatAndUpdateTournament: (values: any) =>
    requests.postForm("api/Tournaments/CAUTournament", createFormData(values)),
  statusHideTournament: (id: number) =>
    requests.get(`api/Tournaments/StatusHideTournament?id=${id}`),
  statusHideTournaments: (year: number) =>
    requests.get(`api/Tournaments/StatusHideTournaments?year=${year}`),
  removeTournament: (id: number) =>
    requests.delete(`api/Tournaments/RemoveTournament?id=${id}`),
};

const Certificates = {
  getCertificates: () => requests.get("api/Certificates/GetCertificate"),
  creatAndUpdateCertificateOne: (values: object) =>
    requests.post("api/Certificates/CAUCertificateONE", values),
  creatAndUpdateCertificate: (values: object) =>
    requests.post("api/Certificates/CAUCertificate", values),
  removeCertificate: (id: number) =>
    requests.delete(`api/Certificates/RemoveCertificate?id=${id}`),
};

const Competitions = {
  getCompetitions: () => requests.get("api/Competitions/GetCompetition"),
  creatAndUpdateCompetition: (values: object) =>
    requests.postForm("api/Competitions/CAUCompetition", createFormData(values)),
  removeCompetition: (id: number) =>
    requests.delete(`api/Competitions/RemoveCompetition?id=${id}`),

  getCompetitionsList: () => requests.get("api/Competitions/GetCompetitionList"),
  creatAndUpdateCompetitionList: (values: object) =>
    requests.post("api/Competitions/CAUCompetitionList", values),
  removeCompetitionList: (id: number) =>
    requests.delete(`api/Competitions/RemoveCompetitionList?id=${id}`),
};

const AllDetail = {
  getAllDetails: () => requests.get("api/AllDetails/GetAllDetail"),
  creatAndUpdateAllDetail: (values: object) =>
    requests.postForm("api/AllDetails/CAUAllDetail", createFormData(values)),
  removeAllDetail: (id: number) =>
    requests.delete(`api/AllDetails/RemoveAllDetail?id=${id}`),
};
const Competes = {
  getCompetes: () => requests.get("api/Competes/GetCompete"),
  creatAndUpdateCompete: (values: any) =>
    requests.post("api/Competes/CAUCompete", values),
  statusHideCompete: (id: number) =>
    requests.get(`api/Competes/StatusHideCompete?id=${id}`),
  statusHideCompetes: (year: number) =>
    requests.get(`api/Competes/StatusHideCompetes?year=${year}`),
  removeCompete: (id: number) =>
    requests.delete(`api/Competes/RemoveCompete?id=${id}`),
};

const SignerDetails = {
  getSignerDetails: () => requests.get("api/SignerDetails/GetSignerDetail"),
  creatAndUpdateSignerDetail: (values: object) =>
    requests.postForm("api/SignerDetails/CAUSignerDetail", createFormData(values)),
  removeSignerDetail: (id: number) =>
    requests.delete(`api/SignerDetails/RemoveSignerDetail?id=${id}`),
};
const TextInImages = {
  getTextInImages: () => requests.get("api/TextInImages/GetTextInImage"),
  creatAndUpdateTextInImage: (values: object) =>
    requests.postForm("api/TextInImages/CAUTextInImage", createFormData(values)),
  removeTextInImage: (id: number) =>
    requests.delete(`api/TextInImages/RemoveTextInImageid=${id}`),
};

const agent = {
  User,
  Levels,
  Matchs,
  Registrations,
  Teams,
  Tournaments,
  Certificates,
  Competitions,
  AllDetail,
  Competes,
  SignerDetails,
  TextInImages
};

export default agent;
