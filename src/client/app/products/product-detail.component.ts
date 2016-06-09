import {Component} from '@angular/core';
import {Router, OnActivate, RouteSegment} from '@angular/router';

import {IProduct} from  './products';
import {ProductService} from './product.service';
import {StarComponent} from '../shared/star.component';

import {DialogService} from '../partials/dialogs/index';

@Component({
  moduleId: module.id,
  templateUrl: 'product-detail.component.html',
  directives: [
    StarComponent
  ]
})

export class ProductDetailComponent implements OnActivate {
  pageTitle:string = 'Product Detail';
  product:IProduct;
  imageWidth:number = 300;
  errorMessage:string;

  constructor(private _productService:ProductService,
              private _router:Router,
              private _dialogService:DialogService) {
  }

  showConfirmDialog():void {
    let msg = `Do you want to delete?`;
    this._dialogService.activate(msg).then((responseOK) => {
      if (responseOK) {
        console.log('deleted');
      }
    });
  }

  routerOnActivate(curr:RouteSegment):void {
    let id = +curr.getParam('id');
    //this.pageTitle += `: ${id}`;
    this.getProduct(id);
  }

  getProduct(id:number) {
    this._productService.getProduct(id)
      .subscribe(
        product => this.product = product,
        error => this.errorMessage = <any>error);
  }

  /*getProduct(id: number) {
   this._productService.getProduct(id)
   .subscribe(
   product => this.product = product,
   error => this.errorMessage = <any>error);
   }*/

  onBack():void {
    this._router.navigate(['/products']);
  }

}
