import { NgModule } from '@angular/core';
import { AlbumService, SearchService } from '@media/shared/service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [SearchService, AlbumService]
})
export class ServiceModule {}
