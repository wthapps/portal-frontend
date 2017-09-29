import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ZNoteHomeModule } from './home/home.module';
import { ZNoteSharedModule } from './shared/shared.module';
import { CoreSharedModule } from '../core/shared/shared.module';
import { ZNoteSettingsModule } from './settings/settings.module';
import { ZNoteMyNoteModule } from './my-note/my-note.module';
import { ZNoteMySharingModule } from './my-sharing/my-sharing.module';
import { ZNoteSearchModule } from './search/search.module';
import { ZNoteSharedWithMeModule } from './shared-with-me/shared-with-me.module';
import { ZNoteMyProfileModule } from './my-profile/my-profile.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// import * as appReducers from './shared/reducers/index';

import { reducers } from './shared/reducers/index';
import * as fromFolder from './shared/models/folder';
import * as fromNote from './shared/models/note';
// import { reducer } from './shared/reducers/index';
import { NoteEffects } from './shared/effects/note-effects';
import { RouterModule } from '@angular/router';


// import { reducers, metaReducers } from './shared/reducers/index';
// import { NoteEffects } from './shared/effects/note-effects';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,


    AppRoutingModule,
    ZNoteHomeModule,
    ZNoteMyNoteModule,
    ZNoteMySharingModule,
    ZNoteSearchModule,
    ZNoteSharedWithMeModule,
    ZNoteMyProfileModule,
    ZNoteSettingsModule,
    ZNoteSharedModule.forRoot(),

    StoreModule.forRoot({
      notes: fromNote.reducer,
      folder: fromFolder.reducer
    }),

    EffectsModule.forRoot([NoteEffects]),

    // StoreRouterConnectingModule,


    CoreSharedModule.forRoot(),
  ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
