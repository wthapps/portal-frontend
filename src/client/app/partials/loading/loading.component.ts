import {Component, ElementRef, OnInit} from '@angular/core';
import {LoadingService} from './loading.service';

@Component({
  moduleId: module.id,
  selector: 'wth-loading',
  templateUrl: './template1/index.html',
  styleUrls: ['./template1/index.css','loading.component.css']
})
export class LoadingComponent implements OnInit {
  /*
   constructor(private _el:ElementRef, private _loadingService:LoadingService) {
   _loadingService.activate = this.activate.bind(this);
   }

   private root:any;

   activate(root = this.root) {
   this.root = root;

   let promise = new Promise<boolean>((resolve, reject) => {
   this.show();
   });

   return promise;
   }

   ngOnInit() {
   this.root = document.getElementById('preloader-wrap');
   }

   private show():void {
   if (!this.root) {
   return;
   }
   this.root.classList.add('active');
   }
   */

}
