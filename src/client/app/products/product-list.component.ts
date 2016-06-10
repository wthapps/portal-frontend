import {Component, OnInit, ViewChild} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import {IProduct} from './products';
import {ProductService} from './product.service';
import {ProductFilterPipe} from './product-filter.pipe';
import {StarComponent} from '../shared/star.component';

declare var bootbox:any;

@Component({
  moduleId: module.id,
  templateUrl: 'product-list.component.html',
  pipes: [ProductFilterPipe],
  directives: [
    StarComponent
    , ROUTER_DIRECTIVES
    , MODAL_DIRECTIVES
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

  alert() {
    bootbox.alert("Hello world!", function () {
      console.log("Hello world callback");
    });
  }

  confirm() {
    bootbox.confirm("Are you sure?", function (result) {
      if (result) {
        console.log("Confirm result: " + result);
      }
    });
  }

  prompt() {
    bootbox.prompt({
      title: "What is your real name?",
      value: "makeusabrew",
      callback: function (result) {
        if (result === null) {
          console.log("Prompt dismissed");
        } else {
          console.log("Hi <b>" + result + "</b>");
        }
      }
    });
  }

  dialog() {
    bootbox.dialog({
      message: "I am a custom dialog",
      title: "Custom title",
      buttons: {
        success: {
          label: "Success!",
          className: "btn-success",
          callback: function () {
            console.log("great success");
          }
        },
        danger: {
          label: "Danger!",
          className: "btn-danger",
          callback: function () {
            console.log("uh oh, look out!");
          }
        },
        main: {
          label: "Click ME!",
          className: "btn-primary",
          callback: function () {
            console.log("Primary button");
          }
        }
      }
    });
  }

  toggleImage():void {
    this.showImage = !this.showImage;
  }

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

  @ViewChild('myModal') modal:ModalComponent;

  close() {
    this.modal.close();
  }

  open() {
    this.modal.open();
  }

}
