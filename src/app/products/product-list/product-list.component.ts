import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  term: string;

  constructor() { }

  ngOnInit(): void {}

  search(value: string){

    this.term = value;

  }
}
