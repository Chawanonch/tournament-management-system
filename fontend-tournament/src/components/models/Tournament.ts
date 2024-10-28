export interface Tournament {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    dateCreated: string;
    listLevels: [
      {
        id: number;
        levelId: number;
        tournamentId: number;
      }
    ];
    isHide: boolean;
    gameImageUrl: string;
    prizes: [
      {
        id: number;
        rank: string;
        price: number;
        tournamentId: number;
      }
    ];
  }
  