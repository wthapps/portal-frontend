import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/debounceTime';

import { ZMediaTaggingService } from './tagging.service';


declare var $: any;
declare var _: any;

@Component({
    selector: 'tagging-el',
  templateUrl: 'tagging-el.component.html'
})
export class TaggingElComponent {
  addedTags: any = [];

  constructor(private taggingService: ZMediaTaggingService) {
  }

  requestAutocompleteItems = (text: string): Observable<Response> => {
    return this.taggingService.getTags(text).map((res:any) => _.map(res.data, 'name'));
  }
}
