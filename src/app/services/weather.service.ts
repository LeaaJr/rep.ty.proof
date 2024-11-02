import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  getWeather(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m`;
    return this.http.get(url);
  }
}