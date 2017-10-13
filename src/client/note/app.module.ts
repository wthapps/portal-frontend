import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ZNoteHomeModule } from './home/home.module';
import { ZNoteFoldersModule } from './folders/folders.module';
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

import { AppEffects, AppStore } from './shared/app-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './shared/reducers/index';
import * as fromNote from './shared/reducers/note';
import * as fromFolder from './shared/reducers/folder';
import * as fromMixEntity from './shared/mixed-enity/mixed-entity.reducer'



@NgModule({
  imports: [
    BrowserModule,
    HttpModule,

    AppRoutingModule,
    ZNoteHomeModule,
    ZNoteFoldersModule,
    ZNoteMyNoteModule,
    ZNoteMySharingModule,
    ZNoteSearchModule,
    ZNoteSharedWithMeModule,
    ZNoteMyProfileModule,
    ZNoteSettingsModule,
    ZNoteSharedModule.forRoot(),

    StoreModule.forRoot(AppStore),
    // StoreModule.forRoot(reducers, {initialState: {
    //   notes: fromNote.noteInitialState,
    //   folders: fromFolder.initialState,
    //   mixedEntity: fromMixEntity.INITIAL,
    //
    // }}),


    StoreDevtoolsModule.instrument({ maxAge: 50 }),

    EffectsModule.forRoot(AppEffects),

    // StoreDevtoolsModule.instrumentOnlyWithExtension(),

    // !(String('<%= BUILD_TYPE %>') === 'prod') ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],

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
