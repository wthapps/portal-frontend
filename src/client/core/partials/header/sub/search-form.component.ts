import { Component, OnInit, OnDestroy } from '@angular/core';
import { SoSearchService } from './social-search.service';
import { Router } from '@angular/router';
import { Constants } from '../../../shared/config/constants';
import { Subject, Subscription } from 'rxjs';


@Component({
  moduleId: module.id,
  selector: 'search-form',
  templateUrl: 'search-form.component.html'
})

export class SearchFormComponent implements OnInit, OnDestroy {
  show: boolean = false;
  type: string = '';
  searchService: SoSearchService;
  result: any;
  groups: any;
  showMore: any;
  text: any = '';
  searchObs$: Subject<string> = new Subject<string>();

  constructor(private socialSearchService: SoSearchService, private router: Router) {
    this.showSearchBar();

    this.searchObs$.debounceTime(Constants.searchDebounceTime)
      .distinctUntilChanged()
      .subscribe( (res: any) => {
          this.searchWithoutSave(res);
        }, (error : any)=> {
          console.log('error', error);
        }
      );
  }

  ngOnInit() {
    this.init('social');

  }

  ngOnDestroy() {
    this.searchObs$.unsubscribe();
  }

  init(type: string) {
    this.type = type;
    if (this.type == 'social') {
      this.searchService = this.socialSearchService;
    }
  }

  searchWithoutSave(e: any) {
    if (e.key == 'Enter') {
      // this.onSaveKey();
      // this.router.navigate([this.showMore.link], {queryParams: {text: this.text}});
      return;
    }

    if (e.key == 'Escape') {
      this.text = '';
      this.result.length = 0;
      this.groups.length = 0;
      this.showMore = '';
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
        console.log(res);
      }
    );
  }

  focusOut() {
    // console.log('out');
    // this.result = null;
  }

  private showSearchBar() {
    let urlOrigin = window.location.origin;

    if (Constants.baseUrls.media == urlOrigin || Constants.baseUrls.chat == urlOrigin || Constants.baseUrls.social == urlOrigin) {
      this.show = true;
    } else {
      this.show = false;
    }
  }
}
