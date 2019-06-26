import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '@shared/services';
import Media from '@shared/modules/photo/models/media.model';

@Component({
  selector: 'shared-modals-addToAlbum',
  templateUrl: 'add-to-album.component.html',
  styleUrls: ['add-to-album.component.scss']
})

export class WModalsAddToAlbumComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() chooseCompleted: EventEmitter <any> = new EventEmitter <any>();
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
