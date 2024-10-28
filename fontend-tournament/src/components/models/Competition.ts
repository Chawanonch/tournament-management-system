export interface Competition {
    id: number;
    name: string;
}

export interface CompetitionList {
    id: number;
    dateTimeYear: string;
    competitionId: number;
    details: [
        {
            id: number;
            name: string;
            text: string;
            competitionListId: number;
        }
    ];
}
