import {Component, Input, Output, OnInit, OnChanges, EventEmitter, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';

import {ApiBaseService} from "../../../shared/services/apibase.service";
import {UserService} from "../../../shared/services/user.service";

@Component({
  moduleId: module.id,
  selector: 'toast-uploading',
  templateUrl: 'toast-uploading.component.html',
  styleUrls: ['toast-upload.component.css']
})
export class ToastUploadingComponent implements OnInit, OnChanges {
  current_photo: any;
  step: number; 
  upload_request: any;
  files_num: number;
  uploaded_num: number;
  stopped_num: number;
  pending_request: any;
  @Input() files: any;

  
  constructor(private apiService: ApiBaseService, private userService: UserService){

  }

  ngOnInit(){
    this.step = 0;          
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['files'].currentValue && changes['files'].currentValue.length > 0){
      this.uploadImages(changes['files'].currentValue);
      this.files_num = this.files.length;
    }
  }

  close(){
    this.step = -1;
  }

  stop(event) {
    event.preventDefault();
    if (this.pending_request){
      this.pending_request.unsubscribe();
    } 
    this.stopped_num = this.files_num - this.uploaded_num;
    this.step = 4;
  }

  private uploadImages(files){    
    var i: number;
    var file_name: string;
    var reader: FileReader;
    var body: string;

    this.step = 1;
    this.uploaded_num = 0;
    this.stopped_num = 0;    
    i = 0;

    do {
      reader = new FileReader();
      reader.onload = (data) => {
      this.current_photo = data.target['result'];
      body = JSON.stringify({photo: {name: file_name, image: this.current_photo}});
       
      this.pending_request =  this.apiService.post(`${this.userService.profile.id}/zone/photos`, body)
        .subscribe((result: any) => {
            this.uploaded_num++;
            console.log('progress', i, this.files_num, this.uploaded_num);
            if (this.uploaded_num == this.files_num){
              this.step = 2;  
            }            
          },
          error => {
            this.step = 3;
          }
        );
      };
      file_name = files[i].name;
      reader.readAsDataURL(files[i]);   
      i++;
      console.log('index: ',i);
    } while (i < files.length)
  }
}
