import { NgModule } from '@angular/core';
import { AlbumService, SearchService } from '@media/shared/service';
import { LocationCustomService } from '@media/shared/service/location-custom.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [SearchService, AlbumService, LocationCustomService]
})
export class ServiceModule {}
