import { RankData } from "./rankData.interface";
import { Weathers } from "./weathers.interface";

export interface Result {
    weathers: Weathers;
    ranking: RankData[];
}