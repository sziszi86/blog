import { Component, OnInit } from '@angular/core';
import { Client } from 'nevnapok';
import { DatePipe } from '@angular/common';
const nevnapok = new Client();
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {
  
  currentDate = new Date();
  nameday : any;
  constructor() { 
    nevnapok.today()
  .then(data => {
    this.nameday = data;
  })}

  ngOnInit() {
    
  }
  

}
