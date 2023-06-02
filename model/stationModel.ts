export interface Station {
    header: string;
    image?: string;
    location?: { latitude: number, longitude: number, accuracy:number };
    description: string;
    answerType: string;
    answer?: string| string[];
    afterCorrectAnswer?:string;
    time?:number;
  }