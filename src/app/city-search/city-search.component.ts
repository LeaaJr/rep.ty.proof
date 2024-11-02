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
  currentHumidity: number | undefined;
  currentTemperature: number | undefined;
  currentWindSpeed: number | undefined;
  favoriteCities: string[] = [];

  constructor(private weatherService: WeatherService, private locationService: LocationService) {
    this.loadFavoriteCities();
  }

  searchWeather() {
    this.locationService.getCoordinates(this.cityName).subscribe(geoData => {
      if (geoData && geoData.length > 0) {
        const latitude = geoData[0].lat;
        const longitude = geoData[0].lon;

        this.weatherService.getWeather(latitude, longitude).subscribe(weatherData => {
          console.log('Datos del clima:', weatherData);
          this.weatherData = weatherData; 

          this.currentHumidity = weatherData.hourly.relative_humidity_2m[0];
          this.currentTemperature = weatherData.hourly.temperature_2m[0]; 
          this.currentWindSpeed = weatherData.hourly.wind_speed_10m[0];

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

  saveFavoriteCity() {
    if (this.cityName && !this.favoriteCities.includes(this.cityName)) {
      this.favoriteCities.push(this.cityName);
      localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities)); // Save in LocalStorage
    }
  }

  // Favourite LocalStorage
  loadFavoriteCities() {
    const storedCities = localStorage.getItem('favoriteCities');
    if (storedCities) {
      this.favoriteCities = JSON.parse(storedCities);
    }
  }
}