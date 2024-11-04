import { Component, ViewChild, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { LocationService } from '../services/location.service';
import {
  Chart,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(
  LineController,
  LinearScale,
  CategoryScale,
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
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Output() weatherDataChange = new EventEmitter<any>(); // Emitir datos de clima al padre

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
      x: {
        type: 'category'
      },
      y: {
        type: 'linear',
        beginAtZero: true
      }
    }
  };

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
    private cdRef: ChangeDetectorRef
  ) {
    this.loadFavoriteCities();
  }

  updateTemperatureData(newData: number[]) {
    this.temperatureData.datasets[0].data = newData;
    this.temperatureData.labels = Array.from({ length: newData.length }, (_, i) => `Hora ${i + 1}`);
    this.chart?.update();
  }

  searchWeather() {
    this.locationService.getCoordinates(this.cityName).subscribe(geoData => {
        if (geoData && geoData.length > 0) {
            const latitude = geoData[0].lat;
            const longitude = geoData[0].lon;

            this.weatherService.getWeather(latitude, longitude).subscribe(weatherData => {
                this.weatherData = weatherData;
                this.currentHumidity = weatherData.hourly.relative_humidity_2m[0];
                this.currentTemperature = weatherData.hourly.temperature_2m[0];
                this.currentWindSpeed = weatherData.hourly.wind_speed_10m[0];

                // Emitir los datos al padre (AppComponent)
                this.weatherDataChange.emit(weatherData);

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

  updateTemperatureTrend(newTemperatureData: number[]) {
    // Actualiza los datos y las etiquetas para el gráfico
    this.temperatureData.datasets[0].data = newTemperatureData;
    this.temperatureData.labels = Array.from({ length: newTemperatureData.length }, (_, i) => `${i + 1}h`);
    
    // Forzar actualización del gráfico
    this.chart?.update();
  }

  loadFavoriteCities() {
    const storedCities = localStorage.getItem('favoriteCities');
    if (storedCities) {
      this.favoriteCities = JSON.parse(storedCities);
    }
  }

  saveFavoriteCity() {
    if (this.cityName && !this.favoriteCities.some(city => city.name === this.cityName)) {
      const favoriteCity = {
        name: this.cityName,
        temperature: this.currentTemperature
      };
      this.favoriteCities.push(favoriteCity);
      this.sortFavoriteCitiesByTemperature();
      localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
      this.chart?.update();
    }
  }
  
  sortFavoriteCitiesByTemperature() {
    this.favoriteCities.sort((a, b) => (b.temperature ?? 0) - (a.temperature ?? 0));
  }

  removeFavoriteCity(city: string) {
    this.favoriteCities = this.favoriteCities.filter(favoriteCity => favoriteCity.name !== city);
    localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
  }
}
