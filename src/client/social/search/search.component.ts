import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'z-social-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ZSocialSearchResultComponent implements OnInit, OnDestroy {

  param: string;
  sub: any;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.sub =  this.route.queryParams.subscribe((params: any) => {
      this.param = params['q'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
