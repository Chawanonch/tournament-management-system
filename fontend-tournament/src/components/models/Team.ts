export interface Team {
    id: number;
    schoolName: string;
    listMembers: [
        {
            id: number;
            name: string;
            position: string;
            teamId: number;
        }
    ];
    listTrainers: [
        {
            id: number;
            name: string;
            position: string;
            teamId: number;
        }
    ];
    created: string;
    userId: number;
    levelId: number;
  }
  