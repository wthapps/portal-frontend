import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'z-social-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.css']
})

export class ZSocialSearchResultComponent implements OnInit, OnDestroy {

  param: string;
  sub: any;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.sub =  this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      this.param = params['q'];
      console.log(this.param, 'this.param');
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
