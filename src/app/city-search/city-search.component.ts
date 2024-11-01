import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.scss']
})
export class CitySearchComponent {
  cityName: string = '';
  weatherData: any;

  constructor(private weatherService: WeatherService, private locationService: LocationService) { }

  searchWeather() {
    this.locationService.getCoordinates(this.cityName).subscribe(geoData => {
      console.log('Datos de geocodificación:', geoData); // Verifica los datos de geocodificación
      if (geoData && geoData.length > 0) {
        const latitude = geoData[0].lat; // Obtén la latitud
        const longitude = geoData[0].lon; // Obtén la longitud
  
        this.weatherService.getWeather(latitude, longitude).subscribe(weatherData => {
          console.log('Datos del clima:', weatherData); // Agrega este log para ver la respuesta del clima
          this.weatherData = weatherData; // Almacena los datos del clima
        }, error => {
          console.error('Error al obtener datos del clima:', error);
        });
      } else {
        console.error('No se encontraron coordenadas para la ciudad:', this.cityName);
      }
    }, error => {
      console.error('Error al obtener coordenadas:', error);
    });
  }
}