import { Component } from '@angular/core';

@Component({
  selector: 'app-test', // Asegúrate de que este selector coincida con el uso en HTML
  templateUrl: './test-component.component.html', // Verifica que la ruta sea correcta
  styleUrls: ['./test-component.component.scss']
})
export class TestComponent {
  cityName: string = ''; // Define la propiedad
  
  searchWeather() {
    console.log(this.cityName); // Lógica para buscar el clima
  }
}
