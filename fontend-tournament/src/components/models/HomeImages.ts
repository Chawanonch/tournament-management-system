export interface HomeImage {
    id: number;
    text: string;
    hoomImages: [
        {
            id: number;
            image: string;
            HomeImageId: number;
        }
    ];
}