import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'z-social-setting',
  templateUrl: 'setting.component.html'
})
export class ZSocialSettingComponent implements OnInit {

  checked1: boolean = true;
  checked2: boolean = true;
  checked3: boolean = true;
  checked4: boolean = true;
  checked5: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

}
