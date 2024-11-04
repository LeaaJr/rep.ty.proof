import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'visor-del-tiempo';
  cityName: string = '';
  weatherData: any; // Almacena los datos de clima
  currentHumidity: number | undefined;
  currentTemperature: number | undefined;
  currentWindSpeed: number | undefined; 
  temperatureData: any = { // Definir temperatureData
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

  onWeatherDataChange(data: any) {
    this.weatherData = data;
    this.currentHumidity = data.hourly.relative_humidity_2m[0];
    this.currentTemperature = data.hourly.temperature_2m[0];
    this.currentWindSpeed = data.hourly.wind_speed_10m[0];
    
    // Actualiza temperatureData con los datos que llegan
    this.temperatureData.datasets[0].data = data.hourly.temperature_2m.slice(0, 24); // Por ejemplo, las próximas 24 horas
    this.temperatureData.labels = Array.from({ length: 24 }, (_, i) => `${i + 1}h`); // Etiquetas para las horas
  }

  chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Horas'
        }
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Temperatura (°C)'
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    }
  };
  
  
}
