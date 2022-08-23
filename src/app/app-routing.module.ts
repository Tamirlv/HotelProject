import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelComponent } from './hotel/hotel.component';
import { AllHotelsComponent } from './all-hotels/all-hotels.component';
import { HoteldashboardComponent } from './hoteldashboard/hoteldashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HotelComponent
  },
  {
    path: 'allhotels',
    component: AllHotelsComponent
  },
  {
    path: 'dashboard',
    component: HoteldashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
