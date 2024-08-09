export interface Weathers {
    [key: string]: WeatherData;
}

export interface WeatherData {
    main: string;
    description: string;
    temp: number;
    maxTemp: number;
    minTemp: number;
}