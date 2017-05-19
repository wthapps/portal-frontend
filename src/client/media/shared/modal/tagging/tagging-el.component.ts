import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { ZMediaTaggingService } from './tagging.service';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
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
