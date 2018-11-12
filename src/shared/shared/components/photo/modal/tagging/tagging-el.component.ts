import { Component } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    return this.taggingService.getTags(text)
      .pipe(
        map((res:any) => res.data.name)
      );
  }
}
