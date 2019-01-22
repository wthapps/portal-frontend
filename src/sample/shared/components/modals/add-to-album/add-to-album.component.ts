import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Media } from '@shared/shared/models/media.model';
import { ApiBaseService } from '@shared/services';

@Component({
  selector: 'shared-modals-addToAlbum',
  templateUrl: 'add-to-album.component.html',
  styleUrls: ['add-to-album.component.scss']
})

export class WModalsAddToAlbumComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() chooseCompleted: EventEmitter<Media> = new EventEmitter<Media>();
  next: string;
  data: Media[];

  constructor(private api: ApiBaseService) {
  }

  ngOnInit(): void {
  }

  async onLoadMore(event: any) {
    if (event && this.next) {
      const data = await this.api.get(this.next).toPromise();
      this.data = data.data;
      this.next = data.meta.links.next;
    }
  }

  onChoose(item: Media) {
    this.chooseCompleted.emit(item);
  }
}
