import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepByStepGuideComponent } from './step-by-step-guide.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StepByStepGuideComponent
  ],
  exports: [
    StepByStepGuideComponent
  ],
  providers: []
})

export class StepByStepGuideModule {
}
