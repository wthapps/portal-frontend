// import { TestBed, async } from '@angular/core/testing';
// import { AppComponent } from './app.component';

// import {
//   Component,
//   ComponentFactoryResolver,
//   ViewChild,
//   ViewContainerRef,
//   OnInit,
//   OnDestroy,
//   AfterViewInit,
//   ViewEncapsulation
// } from '@angular/core';
// import { NavigationEnd, Router } from '@angular/router';
// import { Subscription } from 'rxjs/Subscription';

// import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
// import { takeUntil, filter } from 'rxjs/operators';
// import { timer } from 'rxjs/observable/timer';
// import { ConfirmDialogModel } from '../shared/shared/models/confirm-dialog.model';
// import { Constants } from '../shared/constant/config/constants';

// import { ZContactService } from './shared/services/contact.service';
// import { Group } from './group/group.model';
// import { GroupService } from './group/group.service';
// import { GroupEditModalComponent } from './group/group-edit-modal.component';
// import { GoogleApiService } from './shared/services/google-api.service';
// import { Config } from '../shared/constant/config/env.config';

// import { ZContactSharedSettingsComponent } from './shared/modal/settings/settings.component';
// import {
//   AuthService,
//   CommonEvent,
//   CommonEventAction,
//   CommonEventService
// } from '@wth/shared/services';
// import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
// import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';
// import { ContactService } from '@shared/components/contact-us/contact.service';

// describe('AppComponent', () => {
//   beforeEach(
//     async(() => {
//       TestBed.configureTestingModule({
//         declarations: [AppComponent],
//         providers: [
//           AuthService,
//           ContactService,
//           Router
//           // ComponentFactoryResolver,
//           // CommonEventService,
//           // ZContactService,
//           // GroupService,
//           // GoogleApiService,
//           // WthConfirmService
//         ]
//       }).compileComponents();
//     })
//   );

//   // beforeEach(() => {
//   //   TestBed.configureTestingModule({
//   //     providers: [
//   //       AppComponent,
//   //       AuthService,
//   //       Router,
//   //       ComponentFactoryResolver,
//   //       CommonEventService,
//   //       ZContactService,
//   //       GroupService,
//   //       GoogleApiService,
//   //       WthConfirmService
//   //     ]
//   //   });
//   // });
//   it(
//     'should create the app',
//     async(() => {
//       const fixture = TestBed.createComponent(AppComponent);
//       const app = fixture.debugElement.componentInstance;
//       expect(app).toBeTruthy();
//     })
//   );
//   it(
//     `should have as title 'app'`,
//     async(() => {
//       const fixture = TestBed.createComponent(AppComponent);
//       const app = fixture.debugElement.componentInstance;
//       expect(app.title).toEqual('app');
//     })
//   );
//   it(
//     'should render title in a h1 tag',
//     async(() => {
//       const fixture = TestBed.createComponent(AppComponent);
//       fixture.detectChanges();
//       const compiled = fixture.debugElement.nativeElement;
//       expect(compiled.querySelector('h1').textContent).toContain(
//         'Welcome to app!'
//       );
//     })
//   );
// });
