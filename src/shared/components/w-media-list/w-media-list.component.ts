import { Component, Input } from '@angular/core';
import { Media } from '@shared/shared/models/media.model';
import { WMediaListService } from '@shared/components/w-media-list/w-media-list.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'w-media-list',
  templateUrl: 'w-media-list.component.html',
  styleUrls: ['w-media-list.component.scss']
})

export class WMediaListComponent {
  @Input() data: Media;

  view$: Observable<string>;

  constructor(private mediaListService: WMediaListService) {
    this.view$ = this.mediaListService.view$;
  }
}
