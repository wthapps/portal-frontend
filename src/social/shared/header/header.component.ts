import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TextBoxSearchComponent } from '@wth/shared/shared/components/header/search/components/textbox-search.component';
import { ServiceManager } from '@wth/shared/services';

declare var _:any;

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'social-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class ZSocialSharedHeaderComponent implements OnInit {
  suggestions: any = [];
  show: boolean = false;
  search: string;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location,
              public serviceManager: ServiceManager) {

  }

  ngOnInit() {

    this.route.queryParams.subscribe((params: Params) => {
      this.search = params['q'];
    });
  }

  onEnter(e: any) {
    this.show = false;
    this.router.navigate(['search','all'], {queryParams: {q: e.search}});
  }

  onKey(e: any) {
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
