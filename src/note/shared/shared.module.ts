import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZNoteSharedActionBarComponent } from './toolbar/actions-bar.component';

import { ZNoteService } from './services/note.service';

import { ZNoteSharedModalFolderEditComponent } from './modal/folder/edit.component';
import { ZNoteSharedModalFolderMoveComponent } from './modal/folder/move.component';

import { ZNoteSharedModalSharingComponent } from './modal/sharing/sharing.component';
import { ZFolderService } from './services/folder.service';
import { MixedEntityService } from './mixed-enity/mixed-entity.service';
import { ZNoteSharedBreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ZNoteSharedLeftMenuComponent } from './toolbar/left-menu.component';
import { ZNoteSharedHeaderComponent } from './header/header.component';
import { ZNoteContainerComponent } from '@notes/shared/containers/note-container.component';
import { ZNoteShareProgressComponent } from '@notes/shared/progress/note-progress.component';
import { ZNoteSharedModalEditNameComponent } from '@notes/shared/modal/name/edit.component';
import { ZNoteSharedSettingModule } from './modal/settings/settings.module';
import { ZNoteSharedSettingsService } from './services/settings.service';
import { WthCommonModule } from '@shared/common/wth-common.module';
import { ModalDockModule } from '@shared/shared/components/modal/dock.module';
import { WMediaSelectionModule } from '@shared/components/w-media-selection/w-media-selection.module';
import { ComponentsModule } from '@shared/components/components.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';

import { InputSwitchModule, CheckboxModule, TooltipModule, RadioButtonModule, AutoCompleteModule, PanelMenuModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '@shared/components/modal/modal.module';
import { WModalsModule } from '../../sample/shared/components/modals/modals.module';
import { FolderSortPipe } from './pipes/folder-sort.pipe';
import { WBreadcrumbsModule } from '@shared/components/w-breadcrumbs/w-breadcrumbs.module';
import { WDataViewModule } from '@shared/components/w-dataView/w-dataView.module';
import { PartialModule } from '@shared/partials';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WthCommonModule,

    // custom component
    ModalDockModule,
    ModalModule,
    PartialModule,
    WMediaSelectionModule,
    ComponentsModule,
    BoxNoDataModule,
    WNavTabModule,
    WDataViewModule,
    WModalsModule,
    ZNoteSharedSettingModule,

    // third party libs
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    PanelMenuModule,
    TooltipModule,
    WBreadcrumbsModule
  ],
  declarations: [
    ZNoteSharedActionBarComponent,
    ZNoteContainerComponent,

    // Custom note pipes
    FolderSortPipe,

    ZNoteSharedModalFolderEditComponent,
    ZNoteSharedModalFolderMoveComponent,
    ZNoteSharedModalSharingComponent,
    ZNoteSharedBreadcrumbComponent,
    ZNoteSharedHeaderComponent,
    ZNoteShareProgressComponent,
    ZNoteSharedLeftMenuComponent,
    ZNoteSharedModalEditNameComponent
  ],
  exports: [
    WthCommonModule,

    // custom component
    WDataViewModule,
    ModalDockModule,
    ModalModule,
    PartialModule,
    WMediaSelectionModule,
    ComponentsModule,
    BoxNoDataModule,
    WNavTabModule,
    ZNoteSharedSettingModule,

    // Custom note pipes
    FolderSortPipe,

    // third party libs
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    PanelMenuModule,
    TooltipModule,

    ZNoteSharedActionBarComponent,
    ZNoteSharedHeaderComponent,
    ZNoteContainerComponent,

    ZNoteSharedModalFolderEditComponent,
    ZNoteSharedModalFolderMoveComponent,
    ZNoteSharedModalSharingComponent,
    ZNoteSharedBreadcrumbComponent,
    ZNoteShareProgressComponent,
    ZNoteSharedLeftMenuComponent,
    ZNoteSharedModalEditNameComponent
  ]
})
export class ZNoteSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZNoteSharedModule,
      providers: [
        ZNoteService,
        ZFolderService,
        ZNoteSharedSettingsService,
        MixedEntityService
      ]
    };
  }
}
