import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { WObjectListComponent } from './w-object-list.component';
import { WObjectToolbarViewComponent } from './toolbar/view.component';
import { WObjectListService } from './w-object-list.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { WObjectToolbarSelectedComponent } from '@shared/components/w-object-list/toolbar/selected.component';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    InfiniteScrollModule,
    BoxLoadingModule
  ],
  declarations: [
    WObjectListComponent,
    WObjectToolbarViewComponent,
    WObjectToolbarSelectedComponent
  ],
  exports: [
    WObjectListComponent,
    WObjectToolbarViewComponent,
    WObjectToolbarSelectedComponent
  ],
  providers: [

  ],
})
export class WObjectListModule {
}
