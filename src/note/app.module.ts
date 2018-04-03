import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ZNoteHomeModule } from './home/home.module';
import { ZNoteFoldersModule } from './folders/folders.module';
import { ZNoteSharedModule } from './shared/shared.module';
import { SharedModule } from '@shared/shared.module';
import { ZNoteSettingsModule } from './settings/settings.module';
import { ZNoteMyNoteModule } from './my-note/my-note.module';
import { ZNoteSearchModule } from './search/search.module';
import { ZNoteSharedWithMeModule } from './shared-with-me/shared-with-me.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppEffects, AppStore } from './shared/app-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ZNoteTrashModule } from './trash/trash.module';
import { ZNotePhotoModule } from './photo/photo.module';
import { environment } from '@env/environment';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ZNoteDetailModule } from './detail/detail.module';
import { ZNoteSharedByMeModule } from './shared-by-me/shared-by-me.module';
import { ModalModule } from '@wth/shared/modals/modals.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,

    AppRoutingModule,
    ZNoteHomeModule,
    ZNoteFoldersModule,
    ZNoteMyNoteModule,
    ZNoteDetailModule,
    ZNoteSharedByMeModule,
    ZNoteSearchModule,
    ZNoteSharedWithMeModule,
    // ZNoteMyProfileModule,
    ZNoteSettingsModule,
    ZNoteTrashModule,
    ZNotePhotoModule,
    ModalModule,
    SharedModule.forRoot(),
    ZNoteSharedModule.forRoot(),

    StoreModule.forRoot(AppStore),

    // StoreDevtoolsModule.instrument({ maxAge: 50 }),

    EffectsModule.forRoot(AppEffects),

    // StoreDevtoolsModule.instrumentOnlyWithExtension(),

    !environment.production
      ? StoreDevtoolsModule.instrument({ maxAge: 50 })
      : []

    // SharedModule.forRoot(),
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: WthInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
