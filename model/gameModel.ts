import { Station } from "./stationModel";

export interface Game {
    name: string;
    area: string;
    difficulty: string;
    estimatedTime: string;
    stations: Station[];
    image?: string;
    questions?:string[]
    madeByMail?:string;
    madeByName?:string;
    price?:number;
  }
  