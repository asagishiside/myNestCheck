import { RankData } from './interfaces/rankData.interface'
import { throwError } from 'rxjs';
import { Logger } from '@nestjs/common';

export function formatResult(weather: object, ranking: RankData[]) {
    return {
        weather: {
          main: weather['weather'][0]['main'],
          description: weather['weather'][0]['description'],
          temp: weather['main']['temp'],
          maxTemp: weather['main']['temp_max'],
          minTemp: weather['main']['temp_min'],
          city: weather['name']
        },
        ranking,
    };
}

export function handleError(logger: Logger) {
    return (error: any) => {
        logger.error(error);
        return throwError(() => new Error('Failed'));
    };
}