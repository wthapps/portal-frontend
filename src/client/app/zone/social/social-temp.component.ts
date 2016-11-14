import { Component, OnInit } from '@angular/core';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-temp',
  templateUrl: 'social-temp.component.html'
})

export class ZSocialTempComponent implements OnInit{

  constructor() {
  }

  ngOnInit() {
    $('#modal-social-upload').modal('show');
  }
}
