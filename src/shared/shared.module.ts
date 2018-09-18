import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BsModalModule } from 'ng2-bs3-modal';

import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { RadioButtonModule } from 'primeng/components/radiobutton/radiobutton';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { EditorModule } from 'primeng/components/editor/editor';

import { PipeModule } from './shared/pipe/pipe.module';

import { LoadingModule } from './shared/components/loading/loading.module';
import { FooterModule } from './partials/footer/footer.module';
import { TablePricingModule } from './shared/components/table-pricing/table-pricing.module';
import { ToastsModule } from './shared/components/toast/toast-message.module';
import { CoreChatSupportModule } from './shared/components/chat-support/chat-support.module';
import { UploadCropImageModule } from './shared/components/upload-crop-image/upload-crop-image.module';
import { BreadcrumbModule } from './shared/components/breadcrumb/breadcrumb.module';
import { ZSharedMenuModule } from './shared/components/menu/menu.module';
import { FileModule } from './shared/components/file/file.module';
import { DisplayLinkModule } from './shared/components/link/display-link.module';
import { ZSharedReportModule } from './shared/components/zone/report/report.module';
import { PartialsProfileModule } from './shared/components/profile/profile.module';
import { PartialsPhotoModule } from './shared/components/photo/photo.module';
import { ModalDockModule } from './shared/components/modal/dock.module';
import { EntitySelectModule } from './shared/components/entity-select/entity-select.module';
import { ReadMoreModule } from './shared/components/read-more/read-more.module';
import { CoverProfileModule } from './shared/components/cover-profile/cover-profile.module';
import { ZChatEmojiModule } from './shared/emoji/emoji.module';

import { ShowHidePasswordModule } from './shared/components/show-hide-password/show-hide-password.module';
import { InvitationModule } from './shared/components/invitation/invitation.module';
import { WthConfirmModule } from './shared/components/confirmation/wth-confirm.module';
import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';
import { BoxLoadingModule } from './shared/components/box-loading/box-loading.module';
import { BoxNoDataModule } from './shared/components/box-no-data/box-no-data.module';
import { DirectiveModule } from './shared/directive/directive.module';
import { HttpClientModule } from '@angular/common/http';
import { Ng2CableModule } from 'ng2-cable';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { ImageCropperModule } from '@shared/shared/components/image-cropper/image-cropper.module';
import { MenuContainerModule } from '@shared/shared/components/menu-container/menu-container.module';
import { NotificationListModule } from '@shared/shared/components/notification-list/notification-list.module';
import { WMediaSelectionModule } from '@shared/components/w-media-selection/w-media-selection.module';
import { PartialModule } from '@wth/shared/partials';
import { WTHEmojiModule } from '@shared/components/emoji/emoji.module';
import { ComponentsModule } from '@shared/components/components.module';
import { AccordionModule } from 'primeng/components/accordion/accordion';
import { ModalModule } from '@wth/shared/components/modal/modal.module';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';
import { WEditorModule } from '@shared/components/w-editor/w-editor.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { StickyModule } from 'ng2-sticky-kit';
import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';
import { WUserModule } from '@shared/components/w-user/w-user.module';
import { WLeftMenuModule } from '@shared/components/w-left-menu/w-left-menu.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // BrowserModule,
    HttpClientModule,
    // BrowserAnimationsModule,
    CookieModule.forRoot(),
    InfiniteScrollModule,
    Ng2CableModule,

    PartialModule,
    // Custom modules
    ModalModule,
    WMediaSelectionModule,
    WNavTabModule,
    WEditorModule,
    ScrollToModule.forRoot()
  ],
  declarations: [],
  exports: [
    // Angular modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,

    // Third parties modules
    BsModalModule,
    Ng2CableModule,

    // WTHApps modules
    LoadingModule,
    ToastsModule,
    ConfirmDialogModule,
    InfiniteScrollModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    TooltipModule,
    EditorModule,
    PanelMenuModule,
    DataTableModule,
    AccordionModule,

    WthConfirmModule,
    BoxLoadingModule,
    BoxNoDataModule,

    FooterModule,
    PartialModule,

    TablePricingModule,
    CoreChatSupportModule,
    UploadCropImageModule,
    BreadcrumbModule,
    ZSharedMenuModule,
    FileModule,
    DisplayLinkModule,
    ZSharedReportModule,
    PartialsProfileModule,
    PartialsPhotoModule,
    ModalDockModule,
    EntitySelectModule,
    ReadMoreModule,
    CoverProfileModule,
    ZChatEmojiModule,
    ShowHidePasswordModule,
    InvitationModule,
    ImageCropperModule,
    MenuContainerModule,
    NotificationListModule,
    WTHEmojiModule,
    ScrollToModule,
    StickyModule,

    // Custom modules
    ModalModule,
    WMediaSelectionModule,
    WObjectListModule,
    WNavTabModule,
    WLeftMenuModule,
    ComponentsModule,
    WEditorModule,
    WUserModule,
    // Pipe
    PipeModule,

    // Directive
    DirectiveModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
