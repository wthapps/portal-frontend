import { NgModule } from '@angular/core';
import { PhotoHtmlRoutingModule } from '@media/html/photo-html-routing.module';
import { PhotoHtmlComponent } from '@media/html/photo-html.component';
import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';
// import { SharedModule } from '@shared/shared.module';
import { ZMediaSharedModule } from '@media/shared/shared.module';
import { WUploadModule } from '@shared/components/upload/upload.module';
import { CoreModule } from '@core/core.module';
import { BsModalModule } from 'ng2-bs3-modal';

@NgModule({
  imports: [
    PhotoHtmlRoutingModule,
    ZMediaSharedModule,
    BsModalModule,
    // SharedModule,
    WUploadModule,
    CoreModule,
    WObjectListModule
  ],
  declarations: [PhotoHtmlComponent],
  exports: [],
  providers: []
})
export class PhotoHtmlModule {}
