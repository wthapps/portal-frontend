import { Component, ViewChild } from '@angular/core';
import { TextBoxSearchComponent } from './components/textbox-search.component';
import { ServiceManager } from '../../../services/service-manager';

declare let _: any;

@Component({
  moduleId: module.id,
  templateUrl: 'social-search-form.component.html',
})

export class SocialSearchFormComponent {
  constants: any;
  suggestions: any = [];
  active: boolean;
  show: boolean = false;
  search: string;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  constructor(public serviceManager: ServiceManager) {
    this.constants = this.serviceManager.getConstants();
    this.active = this.constants.search.config.socialActive;
  }

  onEnter(e: any) {
    this.show = false;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: e.search}});
  }

  onKey(e: any) {
    console.log(e);
    if (!e.search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = e.search;
    this.serviceManager.getApi().post(`zone/social_network/search`, {
      q: `${this.search}`,
      types: ['member', 'community']
    }).subscribe(
      (res: any) => {
        this.suggestions.length = 0;
        console.log(res);
        if (res.data.communities || res.data.members) {
          this.suggestions = _.concat(res.data['members'], res.data['communities']);
        }
      }
    );
  }

  onNavigation(data: any) {
    this.show = false;

    if (data.user_name) {
      this.serviceManager.getRouter().navigate([`/profile/${data.uuid}`]);
    } else if (data.admin) {
      this.serviceManager.getRouter().navigate([`/communities/${data.uuid}`]);
    }
  }

}
