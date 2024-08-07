import { RankData } from "./rankData.interface";

export interface Result {
    weather: {
      main: string;
      description: string;
      temp: number;
      maxTemp: number;
      minTemp: number;
      city: string;
    };
    ranking: RankData[];
}