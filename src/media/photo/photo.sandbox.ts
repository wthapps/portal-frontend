// import { Injectable }             from '@angular/core';
// import { Store }      	          from '@ngrx/store';
// import { Subscription }           from 'rxjs';
// import * as storeCore     	          from '@core/store';
// import * as store     	          from '../shared/store';
// import * as photoActions       from '../shared/store/actions/photo.action';
//
// import { Sandbox } from '@wth/core/sandbox/base.sandbox';
// import { Photo } from '../shared/model/photo.model';
//
// @Injectable()
// export class PhotoSandbox extends Sandbox {
//
//   photos$              = this.appState$.select(store.getPhotos);
//   photosLoading$       = this.appState$.select(store.getPhotoLoading);
//   photo$               = this.appState$.select(store.getPhoto);
//   photoFailed$         = this.appState$.select(store.getPhotoFailed);
//   // loggedUser$          = this.appState$.select(store.getLoggedUser);
//
//   private subscriptions: Array<Subscription> = [];
//
//   constructor(
//     protected appStateCore$: Store<storeCore.State>,
//     protected appState$: Store<store.State>) {
//     super(appStateCore$);
//     this.registerEvents();
//   }
//
//   /**
//    * Loads photos from the server
//    */
//   getAll(): void {
//     this.appState$.dispatch(new photoActions.GetAll());
//   }
//
//   /**
//    * Loads photo details from the server
//    */
//   get(id: number): void {
//     this.appState$.dispatch(new photoActions.Get(id));
//   }
//
//   /**
//    * Dispatches an action to select product details
//    */
//   select(photo: Photo): void {
//     this.appState$.dispatch(new photoActions.Select(photo));
//   }
//
//   /**
//    * Unsubscribes from events
//    */
//   unregisterEvents() {
//     this.subscriptions.forEach(sub => sub.unsubscribe());
//   }
//
//   /**
//    * Subscribes to events
//    */
//   private registerEvents(): void {
//     // Subscribes to culture
//     // this.subscriptions.push(this.culture$.subscribe((culture: string) => this.culture = culture));
//     //
//     // this.subscriptions.push(this.loggedUser$.subscribe((user: User) => {
//     //   if (user.isLoggedIn) this.loadProducts();
//     // }))
//   }
// }
