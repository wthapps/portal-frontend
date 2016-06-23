import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import {IProduct} from './products';
import {ProductService} from './product.service';
import {ProductFilterPipe} from './product-filter.pipe';
import {StarComponent} from '../shared/star.component';

import {LoadingService} from '../partials/loading/index';

//declare var bootbox:any;

@Component({
  moduleId: module.id,
  templateUrl: 'product-list.component.html',
  pipes: [ProductFilterPipe],
  directives: [
    StarComponent
    , ROUTER_DIRECTIVES
    , MODAL_DIRECTIVES
  ],
  providers: [
    LoadingService
  ]
})

export class ProductListComponent implements OnInit {
  pageTitle:string = 'Product list!';
  products0:any[] = ['kaka', 'koko'];

  @ViewChild('myModal') modal:ModalComponent;

  listFilter:string = '';

  imageWidth:number = 50;
  showImage:boolean = false;

  errorMessage:string;
  products:IProduct[];

  element:any;

  constructor(private _productService:ProductService
    , private _loadingService:LoadingService
    , private _el:ElementRef) {
    this.element = this._el.nativeElement;
  }

  /*alert() {
    bootbox.alert('Hello world!', function () {
      console.log('Hello world callback');
    });
  }

  confirm() {
    bootbox.confirm('Are you sure?', function (result) {
      if (result) {
        console.log('Confirm result: ' + result);
      }
    });
  }

  prompt() {
    bootbox.prompt({
      title: 'What is your real name?',
      value: 'makeusabrew',
      callback: function (result) {
        if (result === null) {
          console.log('Prompt dismissed');
        } else {
          console.log('Hi <b>' + result + '</b>');
        }
      }
    });
  }

  dialog() {
    bootbox.dialog({
      message: 'I am a custom dialog',
      title: 'Custom title',
      buttons: {
        success: {
          label: 'Success!',
          className: 'btn-success',
          callback: function () {
            console.log('great success');
          }
        },
        danger: {
          label: 'Danger!',
          className: 'btn-danger',
          callback: function () {
            console.log('uh oh, look out!');
          }
        },
        main: {
          label: 'Click ME!',
          className: 'btn-primary',
          callback: function () {
            console.log('Primary button');
          }
        }
      }
    });
  }*/

  toggleImage():void {
    this.showImage = !this.showImage;
    if (this.showImage) {
      //this._loadingService.start(this.element);
      this._loadingService.start($(this.element).find('.table tr > td:first-child'), 1);
    } else {
      //this._loadingService.stop(this.element);
      this._loadingService.stop($(this.element).find('.table tr > td:first-child'));
    }
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



  close() {
    this.modal.close();
  }

  open() {
    this.modal.open();
  }

}
