import { Component } from '@angular/core';
import { SoSearchService } from './social-search.service';
import { Router } from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'search-form',
  templateUrl: 'search-form.component.html'
})

export class SearchFormComponent {
  show: boolean = false;
  type: string = '';
  searchService: any;
  result: any;
  groups: any;
  showMore: any;
  text: any = '';

  constructor(private socialSearchService: SoSearchService, private router: Router) {
  }

  init(type: string) {
    this.show = true;
    this.type = type;
    if (this.type == 'social') {
      this.searchService = this.socialSearchService;
    }
  }

  searchWithoutSave(e: any) {
    if (e.key == 'Enter') {
      this.onSaveKey();
      this.router.navigate([this.showMore.link, {text: this.text}]);
      return;
    }
    this.searchService.search(this.text, ['user', 'community']).subscribe(
      (res: any) => {
        this.result = res.data;
        this.groups = Object.keys(res.data);
        this.showMore = res.show_more;
      }
    );
  }

  onSaveKey() {
    this.result = null;
    this.searchService.saveKey(this.text).subscribe(
      (res: any) => {

      }
    );
  }

  focusOut() {
    // console.log('out');
    // this.result = null;
  }
}
