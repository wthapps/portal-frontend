import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WTHEmojiClassPipe, WTHEmojiPipe } from './emoji.pipe';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

import { WTHEmojiService } from './emoji.service';
import { HttpClientModule } from '@angular/common/http';
import { TooltipModule, OverlayPanelModule } from 'primeng/primeng';
import { AppWTHEmojiComponent } from './emoji.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PipeModule,
    TooltipModule,
    OverlayPanelModule
  ],
  declarations: [WTHEmojiClassPipe, WTHEmojiPipe, AppWTHEmojiComponent],
  exports: [WTHEmojiClassPipe, WTHEmojiPipe, AppWTHEmojiComponent],
  providers: [WTHEmojiService]
})
export class WTHEmojiModule {}
