import { RankData } from './interfaces/rankData.interface'
import { throwError } from 'rxjs';
import { Logger } from '@nestjs/common';
import { WeatherData, Weathers } from './interfaces/weathers.interface';
import { Result } from './interfaces/result.interface';

export function formatResult(weathers: Weathers, ranking: RankData[]): Result {
    return {
        weathers,
        ranking,
    };
}

export function handleError(logger: Logger) {
    return (error: any) => {
        logger.error(error);
        return throwError(() => new Error(error));
    };
}

export function formatWeathers(weathers: WeatherData[]): Weathers {
    const result:Weathers = {};
    weathers.forEach((weather) => {
        result[weather['name']] = {
            main: weather['weather'][0]['main'],
            description: weather['weather'][0]['description'],
            temp: weather['main']['temp'],
            maxTemp: weather['main']['temp_max'],
            minTemp: weather['main']['temp_min'],
        }
    })
    return result;
}