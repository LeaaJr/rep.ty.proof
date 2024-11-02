import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { LocationService } from '../services/location.service';
import {
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra las escalas y elementos que vas a usar
Chart.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  favoriteCities: { name: string; temperature: number | undefined }[] = [];
  
  temperatureData: any = {
    labels: [],
    datasets: [
      {
        label: 'Temperatura',
        data: [],
        fill: false,
        borderColor: 'blue',
        tension: 0.1
      }
    ]
  };

  chartOptions: any = {
    responsive: true,
    scales: {
      y: {
        type: 'linear', // Asegúrate de que el tipo de escala sea correcto
        beginAtZero: true
      }
    }
  };

  constructor(private weatherService: WeatherService, private locationService: LocationService) {
    this.loadFavoriteCities();
  }

  updateTemperatureData(newData: number[]) {
    this.temperatureData.datasets[0].data = newData;
    this.temperatureData.labels = Array.from({ length: newData.length }, (_, i) => `Hora ${i + 1}`); // Etiquetas para cada hora
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
          console.log('Temperatura actual:', this.currentTemperature);
          console.log('Velocidad del viento actual:', this.currentWindSpeed);

          // Llamar a la función para actualizar el gráfico con datos de las próximas 24 horas
          this.updateTemperatureTrend(weatherData.hourly.temperature_2m);
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
    if (this.cityName && !this.favoriteCities.some(city => city.name === this.cityName)) {
      const favoriteCity = {
        name: this.cityName,
        temperature: this.currentTemperature
      };
      this.favoriteCities.push(favoriteCity);
      localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities)); // Guardar en LocalStorage como string
      this.sortFavoriteCitiesByTemperature(); // Ordenar después de agregar
    }
  }

  loadFavoriteCities() {
    const storedCities = localStorage.getItem('favoriteCities');
    if (storedCities) {
      this.favoriteCities = JSON.parse(storedCities);
    }
    this.sortFavoriteCitiesByTemperature(); // Ordenar al cargar
  }

  removeFavoriteCity(city: string) {
    this.favoriteCities = this.favoriteCities.filter(favoriteCity => favoriteCity.name !== city);
    localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities)); // Actualiza LocalStorage
  }

  sortFavoriteCitiesByTemperature() {
    this.favoriteCities.sort((a, b) => (b.temperature ?? 0) - (a.temperature ?? 0));
  }

  updateTemperatureTrend(temperatureData: number[]) {
    const next24HoursData = temperatureData.slice(0, 24); // Obtener las próximas 24 horas de datos
    this.updateTemperatureData(next24HoursData);
  }
}
