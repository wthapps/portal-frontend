import { DoublyLinkedLists } from '@shared/data-structures/link-list/doubly-linked-lists';
import { Router } from '@angular/router';

/* MediaPreviewMixin for preview */
export class MediaPreviewMixin {
  listIds: DoublyLinkedLists;

  constructor(public router: Router) {}

  onPrev(term: any = 'videos') {
    this.listIds.prev();
    this.router.navigate([`/${term}/${this.listIds.current.data}`, { ids: this.listIds.data }]);
  }

  onNext(term: any = 'videos') {
    this.listIds.next();
    this.router.navigate([`/${term}/${this.listIds.current.data}`, { ids: this.listIds.data }]);
  }
}
