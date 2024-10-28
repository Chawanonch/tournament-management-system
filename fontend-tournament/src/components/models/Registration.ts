export interface Registration {
  id: number;
  tournamentId: number;
  teamId: number;
  teamName: string;
  status: number;
  dateRegistration: string;
  number: number;
}

export interface RegistrationCompete {
  id: number;
  competeId: number;
  teamId: number;
  teamName: string;
  status: number;
  dateRegistration: string;
  number: number;
}
