export interface Compete {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    dateCreated: string;
    isHide: boolean;
    competitionListId: number;
    listLevelCompetes: [
        {
          id: number;
          levelId: number;
          competeId: number;
        }
      ];
  }
  