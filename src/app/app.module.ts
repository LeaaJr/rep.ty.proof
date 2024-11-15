import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CitySearchComponent } from './city-search/city-search.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';



@NgModule({
  declarations: [
    AppComponent,
    CitySearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MdbCollapseModule,
    HttpClientModule,
    BaseChartDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
