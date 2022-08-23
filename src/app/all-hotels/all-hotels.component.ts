import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-all-hotels',
  templateUrl: './all-hotels.component.html',
  styleUrls: ['./all-hotels.component.css']
})
export class AllHotelsComponent implements OnInit {
  allHotels: any;
  allHotelsData: any;
  cols: any;
  filter: any;
  constructor(
    private http: HttpClient,

  ) {
    this.http.get("https://b84epoyaqf.execute-api.us-east-2.amazonaws.com/dev/hotel").subscribe((data) => {
      this.allHotels = data;
      this.allHotelsData = data;
      console.log(data);
    })
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'image', header: 'Image' },
    ];
  }

  ngOnInit(): void {
  }
  filterTable() {
    let allHotelsData = this.allHotels;
    console.log(allHotelsData);
    const result = allHotelsData.filter((hotel: any) => {
      console.log(hotel.name, this.filter);
      return hotel.name.includes(this.filter);
    })
    this.allHotelsData = result;
  }
}
