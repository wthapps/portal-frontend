import {Component, AfterViewInit, OnInit, ElementRef} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {ToastUploadingComponent} from './toast-upload/index';
import {ApiBaseService} from "../../shared/services/apibase.service";
import {UserService} from "../../shared/services/user.service";
// import {LoadingService} from "../../../../../dist/tmp/app/partials/loading/loading.service";
// import {ToastsService} from "../../../../../dist/tmp/app/partials/toast/toast-message.service";

declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'page-zone-picture',
  templateUrl: 'picture.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ToastUploadingComponent
  ]
})

export class ZPictureComponent implements AfterViewInit, OnInit {

  advSearch: boolean = false;
  photo_input_element: any = null;  
  files: any;
  // test_img: any;


  constructor(
    private element: ElementRef,
    private apiService: ApiBaseService,
    private userService: UserService
  ){


  }
  ngOnInit() {
    this.image_src = '';
    this.step = 0;
    // this.photo_input_element = document.getElementById('photo_input_element');
    this.photo_input_element = this.element.nativeElement.querySelector('#photo_input_element');
    // this.test_img = this.element.nativeElement.querySelector('.img-center');

  }

  ngAfterViewInit() {
    let _this = this;
    $('body').on('click', function () {
      _this.advSearch = false;
    });

    $('body').on('click', '.advSearch', function (e) {
      e.stopPropagation();
    });
  }

  toggleShowSearch(e): void {
    e.stopPropagation();
    this.advSearch = (this.advSearch == true ? false : true);
  }

  openFileWindow(element_id: string, event: any) {
    event.preventDefault();
    // var input = $(`#${element_id}`);
    // input.click();
    this.photo_input_element.value = null;
    this.photo_input_element.click();
  }

  handleFileUpload(event){
        
    this.files = event.target.files;
    if (this.files.length == 0){
      return;
    }
  }

  onDrop(event: any){
    event.stopPropagation();
    event.preventDefault();
    this.files = event.dataTransfer.files;
    if (this.files.length == 0) return;
  }

  dragleave(){

  }

  dragover(event){
    event.preventDefault();
    console.log('drag over');
  }

  dragenter(){
    
  }
  
  private uploadImages(files){    
    // var i: number;
    // var reader: FileReader;
    // var body: string;
    // this.step = 1;
    
    // i = 0;
    // do {
    //   reader = new FileReader();
    //   reader.onload = (data) => {
    //     this.image_src = data.target.result;
    //     body = JSON.stringify({photo: {image: this.image_src}});
    //     this.apiService.post(`${this.userService.profile.id}/zone/photos`, body)
    //     .subscribe((result: any) => {
    //         console.log("result: ",i, result);
    //         this.step = 2;
    //       },
    //       error => {
    //         this.step = 3;
    //       }
    //     );
    //   };
    //   reader.readAsDataURL(files[i]);      
      
    //   i++;
    // } while (i < files.length)
  }

}
