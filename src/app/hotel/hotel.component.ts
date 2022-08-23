import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

export interface DialogData {
}

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit {
  displayedColumns: string[] = ['name', 'image'];
  hotelName: any;
  hotelImage: any;
  allHotelsData: any;
  hotelAddress: any;
  allHotels: any;
  hotelToUpdate: any;
  roomType: any;
  totalRooms: any;
  hotelToBook: any
  Date: any;
  filter: any;
  roomToBook: any;
  hotelRooms: any;
  from: any;
  to: any;
  user: any;
  creating: boolean = false;
  date: any = new Date();
  cols: any = [
    { field: 'name', header: 'Name' },
    { field: 'image', header: 'Image' },
  ];
  constructor(
    private http: HttpClient,
  ) {
  }
  ngOnInit(): void {
    this.getAllHotels();
  }
  // Gets all hotels from ddb
  getAllHotels() {
    // this.http.get("http://localhost:8080/hotel/getHotels").subscribe((data) => {
    this.http.get("https://b84epoyaqf.execute-api.us-east-2.amazonaws.com/dev/hotel").subscribe((data) => {
      this.allHotels = data;
      this.allHotelsData = data;
    })
  }

  // Add an hotel to ddb
  addHotel() {
    if (this.hotelName && this.hotelImage && this.hotelAddress) {

      let body = {
        name: this.hotelName,
        image: this.hotelImage,
        address: this.hotelAddress
      };
      this.http.post("https://b84epoyaqf.execute-api.us-east-2.amazonaws.com/dev/hotel", body).subscribe((data) => {
        alert('Hotel Created')
        this.getAllHotels();
      })
      this.hotelName = "";
      this.hotelAddress = "";
      this.hotelImage = "";
    } else {
      alert('Please fill all input correctly')
    }
  }
  // Creates a room in ddb
  addRoom() {
    if (this.hotelToUpdate && this.roomType && this.totalRooms) {
      let body = {
        hotel_id: this.hotelToUpdate.id,
        name: this.roomType,
        total_rooms: JSON.parse(this.totalRooms)
      }
      this.http.post("https://b84epoyaqf.execute-api.us-east-2.amazonaws.com/dev/room", body).subscribe((data) => {
        alert('Room Created');
      })
      this.hotelToUpdate = "";
      this.roomType = "";
      this.totalRooms = "";
    } else {
      alert('Please fill all input correctly')
    }
  }
  // Starts booking conversation
  startBooking() {
    if (this.hotelToBook) {
      this.creating = true;
      let params = new HttpParams().set('hotel_id', this.hotelToBook.id);
      this.http.get("https://b84epoyaqf.execute-api.us-east-2.amazonaws.com/dev/room", { params }).subscribe((data) => {
        this.hotelRooms = data;
      })
    } else {
      alert('Please choose the hotel you want to book')
    }

  }
  // Creates a reservation in ddb
  bookRoom() {
    if (this.to && this.from && this.roomToBook && this.user) {
      let dateTo = this.to + 'T23:59';
      let dateFrom = this.from + 'T00:00';
      let body = {
        hotel_id: this.roomToBook.hotel_id,
        room_id: this.roomToBook.id,
        user: this.user,
        from: dateFrom.valueOf(),
        to: dateTo.valueOf()
      }
      this.http.post("https://b84epoyaqf.execute-api.us-east-2.amazonaws.com/dev/reservation", body).subscribe((data: any) => {
        alert(data.message);
      })
    } else {
      alert('Please fill all inputs');
    }
  }
  hotelChange() {
    this.creating = false;
  }
}
