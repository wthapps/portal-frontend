import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveItemDisplayPipe } from './drive-item-display.pipe';
import { ItemListDisplayPipe } from './item-list-display.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [DriveItemDisplayPipe, ItemListDisplayPipe],
  exports: [DriveItemDisplayPipe, ItemListDisplayPipe],
  providers: []
})
export class DrivePipeModule {}
