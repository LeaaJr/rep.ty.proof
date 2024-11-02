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
  favoriteCities: string[] = []; // Array para almacenar ciudades favoritas

  constructor(private weatherService: WeatherService, private locationService: LocationService) {
    this.loadFavoriteCities(); // Cargar ciudades favoritas al iniciar el componente
  }

  searchWeather() {
    this.locationService.getCoordinates(this.cityName).subscribe(geoData => {
      if (geoData && geoData.length > 0) {
        const latitude = geoData[0].lat;
        const longitude = geoData[0].lon;

        this.weatherService.getWeather(latitude, longitude).subscribe(weatherData => {
          console.log('Datos del clima:', weatherData); // Verifica la respuesta del clima
          this.weatherData = weatherData; // Almacena los datos del clima

          // Accede a la humedad, temperatura y velocidad del viento
          this.currentHumidity = weatherData.hourly.relative_humidity_2m[0]; // Humedad
          this.currentTemperature = weatherData.hourly.temperature_2m[0]; // Temperatura
          this.currentWindSpeed = weatherData.hourly.wind_speed_10m[0]; // Velocidad del viento

          // Verifica los valores en la consola
          console.log('Temperatura actual:', this.currentTemperature);
          console.log('Velocidad del viento actual:', this.currentWindSpeed);
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

  // Método para guardar la ciudad favorita
  saveFavoriteCity() {
    if (this.cityName && !this.favoriteCities.includes(this.cityName)) {
      this.favoriteCities.push(this.cityName);
      localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities)); // Guardar en LocalStorage
    }
  }

  // Método para cargar ciudades favoritas desde LocalStorage
  loadFavoriteCities() {
    const storedCities = localStorage.getItem('favoriteCities');
    if (storedCities) {
      this.favoriteCities = JSON.parse(storedCities);
    }
  }

  // Método para eliminar una ciudad de favoritos
  removeFavoriteCity(city: string) {
    this.favoriteCities = this.favoriteCities.filter(favoriteCity => favoriteCity !== city); // Filtra la ciudad a eliminar
    localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities)); // Actualiza LocalStorage
  }
}