import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { HotelComponent } from './hotel/hotel.component';
import { SidebarModule } from "primeng/sidebar";
// import { MenuComponent } from './menu/menu.component';
import { AllHotelsComponent } from './all-hotels/all-hotels.component';
import { HoteldashboardComponent } from './hoteldashboard/hoteldashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    HotelComponent,
    // MenuComponent,
    AllHotelsComponent,
    HoteldashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    SidebarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
