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

  params: string;
  sub: any;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.sub =  this.route.queryParams.subscribe((params: any) => {
      this.params = params['q'];

      console.debug('queryParams: ', params);
    });

    this.route.fragment.subscribe((f: any) => {
      console.debug('search fragment: ', f);
    });



  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
