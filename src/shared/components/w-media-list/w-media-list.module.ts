import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridListModule } from '@shared/components/grid-list/grid-list.module';
import { WMediaListService } from '@shared/components/w-media-list/w-media-list.service';
import { WMediaListComponent } from './w-media-list.component';
import { WMediaToolbarViewComponent } from '@shared/components/w-media-list/toolbar/view.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    GridListModule,
    PipeModule
  ],
  declarations: [
    WMediaListComponent,
    WMediaToolbarViewComponent
  ],
  exports: [
    WMediaListComponent,
    WMediaToolbarViewComponent
  ],
  providers: [
    WMediaListService
  ],
})
export class WMediaListModule {
}
