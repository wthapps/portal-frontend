import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TextBoxSearchComponent } from '@wth/shared/partials/search-box/textbox-search.component';
import { ApiBaseService } from '@wth/shared/services';

declare var _: any;

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'social-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class ZSocialSharedHeaderComponent implements OnInit {
  suggestions: any = [];
  show: boolean = false;
  search: string;
  searchAdvanced: boolean = false;
  objectType: any;

  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiBaseService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.search = params['q'];
    });
  }

  // onSearchAdvanced(e: any) {
  //   this.searchAdvanced = e.searchAdvanced;
  // }

  clickedInside($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers
  }

  onEscape(e?: any) {
    this.show = false;
  }

  onEnter(search: string) {
    this.show = false;
    let paths = location.pathname.toString().split('/');
    let term = 'all';
    if (paths[1] === 'search' && paths[2] !== '') {
      term = paths[2].split(';')[0];
    }
    this.search = search;
    this.router.navigate(['/search', term, {q: this.search}], {queryParams: {q: this.search}});
  }

  onKey(search: any) {
    if (!search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = search;
    this.api.post(`zone/social_network/search`, {
      q: `${this.search}`,
      types: ['members', 'communities']
    }).subscribe(
      (res: any) => {
        this.suggestions.length = 0;
        if (res.data.communities || res.data.members) {
          this.suggestions = _.concat(res.data['members'], res.data['communities']);
        }
      }
    );
  }

  onNavigation(data: any) {
    this.show = false;

    if (data.user_name) {
      this.router.navigate([`/profile/${data.uuid}`]);
    } else if (data.admin) {
      this.router.navigate([`/communities/${data.uuid}`]);
    }
  }
}
