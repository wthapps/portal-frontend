import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'primeng/components/tooltip/tooltip';

import { ModalDockComponent } from './dock.component';
import { ModalDockHeaderComponent } from './components/dock-header.component';
import { ModalDockBodyComponent } from './components/dock-body.component';
import { ModalDockFooterComponent } from './components/dock-footer.component';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule
  ],
  declarations: [
    ModalDockComponent,
    ModalDockHeaderComponent,
    ModalDockBodyComponent,
    ModalDockFooterComponent
  ],
  exports: [
    ModalDockComponent,
    ModalDockHeaderComponent,
    ModalDockBodyComponent,
    ModalDockFooterComponent
  ],
  providers: []
})

export class ModalDockModule {
}
