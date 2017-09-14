import { Component, ViewChild } from '@angular/core';
import { TextBoxSearchComponent } from '../../../core/shared/components/header/search/components/textbox-search.component';
import { ServiceManager } from '../../../core/shared/services/service-manager';

declare var _:any;

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'social-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
})
export class ZSocialSharedHeaderComponent {
  suggestions: any = [];
  show: boolean = false;
  search: string;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  constructor(public serviceManager: ServiceManager) {
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
