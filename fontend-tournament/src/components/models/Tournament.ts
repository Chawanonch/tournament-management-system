export interface Tournament {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    dateCreated: string;
    isHide: boolean;
    listLevels: [
      {
        id: number;
        levelId: number;
        tournamentId: number;
      }
    ];
  }
  