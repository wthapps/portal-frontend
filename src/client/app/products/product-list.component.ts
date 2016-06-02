import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';


import {IProduct} from './products';
import {ProductService} from './product.service';
import {ProductFilterPipe} from './product-filter.pipe';
import {StarComponent} from '../shared/star.component';

@Component({
  moduleId: module.id,
  templateUrl: 'product-list.component.html',
  pipes: [ProductFilterPipe],
  directives: [
    StarComponent
    , ROUTER_DIRECTIVES
  ]
})

export class ProductListComponent implements OnInit {
  pageTitle:string = 'Product list!';
  products0:any[] = ['kaka', 'koko'];

  listFilter:string = '';

  imageWidth:number = 50;
  showImage:boolean = false;

  errorMessage:string;
  products:IProduct[];

  constructor(private _productService:ProductService) {
  }

  toggleImage():void {
    this.showImage = !this.showImage;
  };

  /*ngOnInit():void {
   //console.log('OnInit tested')
   this.products = this._productService.getProducts();
   }*/

  ngOnInit():void {
    this._productService.getProducts().subscribe(
      products => this.products = products,
      error => this.errorMessage = <any>error
    );
  }

  onRatingClicked(message:string):void {
    this.pageTitle = 'Product List: ' + message;
  }
}
