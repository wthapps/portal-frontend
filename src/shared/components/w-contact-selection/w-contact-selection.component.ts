import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BsModalComponent } from 'ng2-bs3-modal';

import { Constants } from '@shared/constant';
import { Observable } from 'rxjs';

@Component({
  selector: 'w-contact-selection',
  templateUrl: 'w-contact-selection.component.html',
  styleUrls: ['w-contact-selection.component.scss']
})

export class WContactSelectionComponent implements OnInit {

  @ViewChild('modal') modal: BsModalComponent;
  @Input() contacts: any; // suggested users

  @Output() selected = new EventEmitter<any>();

  title: string;
  filter: any;
  loading = false;
  selectingUsers: Array<any> = [];

  search$ = new Subject<string>();

  subscription: Subscription;
  searchSubscription: Subscription;
  readonly searchDebounceTime: number = Constants.searchDebounceTime;

  constructor() {  }

  ngOnInit() {
    // this.searchSubscription = this.search$.pipe(
    //   debounceTime(Constants.searchDebounceTime),
    //   distinctUntilChanged(),
    //   switchMap((searchEvent: any) => this.apiBaseService.get(`account/search?q=${searchEvent.query}`)))
    //   .subscribe((res: any) => {
    //       const selectedIds = this.selectedUsers.map(user => user.id);
    //       this.suggestedUsers = res.data.filter(user => !selectedIds.includes(user.id));
    //     },
    //     (error: any) => {
    //       console.log('error', error);
    //     }
    //   );
  }

  open(options: any) {
    this.title = options.title || 'Select Contact';
    this.modal.open().then();
  }

  close() {
    this.modal.close().then();
  }

  search() {
  }

  toggleUserSelection(user: any) {

    let hasUser = false;
    this.selectingUsers.forEach((u, i) => {
      if (user.uuid === u.uuid) {
        this.selectingUsers.splice(i, 1);
        hasUser = true;
        return;
      }
    });
    if (!hasUser) {
      this.selectingUsers.push(user);
    }

  }

  isSelectingUser(user: any): Observable<boolean> {
    this.selectingUsers.forEach((u) => {
      if (user.uuid === u.uuid) {
        return of(true);
      }
    });
    return of(false);
  }

  onSelected() {
    this.selected.emit({selectedUsers: this.selectingUsers});
  }

}
