import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ZMediaToolbarComponent } from './toolbar/toolbar.component';
import { ZMediaSortbarComponent } from './sortbar/sortbar.component';
import { ZMediaFormAddToAlbumComponent } from './form/form-add-to-album.component';
import { Ng2HdModule } from '../../shared/ng2-hd/ng2-hd.module';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Ng2HdModule
  ],
  declarations: [
    ZMediaToolbarComponent,
    ZMediaSortbarComponent,
    ZMediaFormAddToAlbumComponent
  ],
  exports: [
    ZMediaToolbarComponent,
    ZMediaSortbarComponent,
    ZMediaFormAddToAlbumComponent
  ]
})
export class ZMediaSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZMediaSharedModule,
      providers: [

      ]
    };
  }
}
