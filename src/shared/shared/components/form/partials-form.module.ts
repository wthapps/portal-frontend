import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuestionControlService } from './base/question-control.service';
import { DynamicFormQuestionComponent } from './base/dynamic-form-question.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DynamicFormQuestionComponent
  ],
  exports: [
    DynamicFormQuestionComponent
  ],
  providers: [
    QuestionControlService
  ]
})

export class PartialsFormModule {
}

