import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CitySearchComponent } from './city-search/city-search.component';
import { TestComponent } from './test-component/test-component.component'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './services/weather.service'; 
import { LocationService } from './services/location.service'; 

@NgModule({
  declarations: [
    AppComponent,
    CitySearchComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [], // No es necesario agregar LocationService aquí
  bootstrap: [AppComponent]
})
export class AppModule { }