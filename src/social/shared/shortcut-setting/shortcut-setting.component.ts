import { Component, ViewChild, OnDestroy } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable ,  Subject } from 'rxjs';
import { Store } from '@ngrx/store';
// import { AutoCompleteModule } from 'primeng/autocomplete';

import * as fromRoot from '../../shared/reducers';
import { SoShortcutService } from '../services/shortcut.service';
import { takeUntil } from 'rxjs/operators';
import { SHORTCUT_ADD_MULTI } from '../reducers/index';
import { SHORTCUTS_REMOVE } from '../reducers/index';

@Component({
  selector: 'z-social-shortcut-setting',
  templateUrl: 'shortcut-setting.component.html',
  styleUrls: ['shortcut-setting.component.scss']
})

export class ZSocialShortcutSettingComponent implements OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;

  shortcuts$: Observable<any>;
  selectedComs: any[] = [];
  removeComsHash: {[id: string]: string} = {};
  removeLength: number = 0;

  suggestions: any[] = [];
  hasChanged: boolean;
  private destroySubject: Subject<any> = new Subject();

  constructor(private store: Store<any>,
              private shortcutService: SoShortcutService) {
    this.shortcuts$ = this.store.select(fromRoot.getShortcuts);
  }

  ngOnDestroy(){
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  search(event: any) {
    console.log('inside search: ', event);

    this.shortcutService.getSuggestions(event.query).pipe(
      takeUntil(this.destroySubject)
    ).subscribe((res: any) => {
      this.suggestions = res.data;
    });
  }

  selectCommunity(event? : any) {
    this.hasChanged = true;
  }

  unselect(event?: any) {
    if(this.selectedComs.length == 0)
      this.hasChanged = false;
  }

  clear(event?: any) {
    this.hasChanged = true;
  }

  remove(comId: string) {
    console.debug('comId: ', comId);
    this.removeComsHash[comId] = comId;
    this.removeLength = Object.keys(this.removeComsHash).length;
    this.hasChanged = true;
  }

  done(event?: any) {
    this.modal.close();
  }

  save() {
    if( this.selectedComs.length > 0 )
      this.store.dispatch({type: SHORTCUT_ADD_MULTI, payload: this.selectedComs});

    if( Object.keys(this.removeComsHash).length > 0) {
      let ids: string[] = Object.keys(this.removeComsHash);
      console.debug('this.removeComsHash: ', this.removeComsHash, ids);
      this.store.dispatch({type: SHORTCUTS_REMOVE, payload: {ids}});
    }

    this.reset();
  }

  cancel() {
    this.reset();
  }

  private reset() {
    this.removeComsHash = {};
    this.removeLength = 0;
    this.selectedComs = [];
    this.hasChanged = false;
  }
}
