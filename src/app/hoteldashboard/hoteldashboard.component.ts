import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-hoteldashboard',
  templateUrl: './hoteldashboard.component.html',
  styleUrls: ['./hoteldashboard.component.css']
})
export class HoteldashboardComponent implements OnInit {
  allHotels: any;
  allReservation: any;
  totalRes = [
    { field: 'name', header: 'Name' },
    { field: 'totalRes', header: 'Total Reservations' },
  ];
  todayRes = [
    { field: 'name', header: 'Name' },
    { field: 'todayRes', header: 'Today Reservations' },
  ];
  constructor(
    private http: HttpClient,

  ) { }

  ngOnInit(): void {
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    let tomorrow = new Date();
    tomorrow.setDate(date.getDate() + 1)
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    this.http.get("https://b84epoyaqf.execute-api.us-east-2.amazonaws.com/dev/hotel").subscribe((data) => {
      this.allHotels = data;
      this.allHotels.forEach((element: any) => {
        element['totalRes'] = 0;
        element['todayRes'] = 0;
      })
      this.http.get("https://b84epoyaqf.execute-api.us-east-2.amazonaws.com/dev/reservation").subscribe((data1) => {
        this.allReservation = data1;
        this.allHotels.forEach((hotel: any) => {
          this.allReservation.forEach((reserveation: any) => {
            if (hotel.id == reserveation.hotel_id) {
              hotel.totalRes++;
              if (reserveation.book_date >= date && reserveation.book_date <= tomorrow) {
                hotel.todayRes++
              }
            }
          });
        });
        this.allHotels.sort(function (a: any, b: any) {
          return b.totalRes - a.totalRes;
        })
      })

    })


  }

}
