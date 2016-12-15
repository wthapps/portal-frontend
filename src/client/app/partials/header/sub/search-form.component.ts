import { Component, OnInit, Input } from '@angular/core';
import { SoSearchService } from './social-search.service';

@Component({
  moduleId: module.id,
  selector: 'search-form',
  templateUrl: 'search-form.component.html'
})

export class SearchFormComponent implements OnInit{
  show: boolean = false;
  type: string = '';
  searchService: any;
  result: any;
  groups: any;
  showMore: boolean = false;

  constructor(private socialSearchService: SoSearchService) {

  }

  ngOnInit() {
  //
  }

  init(type:string) {
    this.show = true;
    this.type = type;
    if(this.type == "social") {
      this.searchService = this.socialSearchService
    }
  }

  searchWithoutSave(text:any) {
    this.searchService.search(text).subscribe(
      (res:any) => {
        this.result = res.data;
        this.groups = Object.keys(res.data);
        this.showMore = res.show_more;
        console.log(res);
      }
    )
  }
  onClick() {
    this.result = null;
  }
}
