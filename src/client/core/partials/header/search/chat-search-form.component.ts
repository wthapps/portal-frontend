import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ServiceManager } from '../../../shared/services/service-manager';
import { NavigationEnd } from '@angular/router';
import { TextBoxSearchComponent } from './components/textbox-search.component';

declare let _:any;

@Component({
  moduleId: module.id,
  templateUrl: 'chat-search-form.component.html',
})

export class ChatSearchFormComponent implements OnInit {
  constants:any;
  suggestions:any;
  active:boolean;
  show:boolean = false;
  search: string;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  constructor(public serviceManager: ServiceManager) {
    this.constants = this.serviceManager.getConstants();
    this.active = this.constants.search.config.chatActive;
  }

  ngOnInit() {
  //
  }

  onEnter(e:any) {
    this.show = false;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: e.search}});
  }

  onKey(e:any) {
    if(!e.search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = e.search;
    this.serviceManager.getApi().get('zone/chat/search', {q: e.search}).subscribe((res:any) => {
      this.suggestions = res.data;
    });
  }

  setText(data:any) {
    this.show = false;
    if(data.group_json.group_type == 'couple') {
      this.textbox.search = data.display.name;
    }
    if(data.group_json.group_type == 'multiple') {
      if (data.group_json.name) {
        this.textbox.search = data.group_json.name;
      } else {
        this.textbox.search = data.group_json.users_name;
      }
    }
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: this.textbox.search}});
  }
}
