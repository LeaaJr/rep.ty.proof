import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'https://nominatim.openstreetmap.org/search'; // URL de la API de Nominatim

  constructor(private http: HttpClient) {}

  getCoordinates(city: string): Observable<any> {
    const url = `${this.apiUrl}?q=${encodeURIComponent(city)}&format=json`;
    return this.http.get(url);
  }
}