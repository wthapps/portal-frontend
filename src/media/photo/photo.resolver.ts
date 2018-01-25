// import { Injectable }       from '@angular/core';
// import {
//   Resolve,
//   ActivatedRouteSnapshot
// }                           from '@angular/router';
// import { PhotoSandbox }  from './photo.sandbox';
//
// @Injectable()
// export class PhotoResolver implements Resolve<any> {
//
//   private photoSubscription;
//
//   constructor(public photoSandbox: PhotoSandbox) {}
//
//   /**
//    * Triggered when application hits product details route.
//    * It subscribes to product list data and finds one with id from the route params.
//    *
//    * @param route
//    */
//   public resolve(route: ActivatedRouteSnapshot) {
//     if (this.photoSubscription) return;
//
//     this.photoSubscription = this.photoSandbox.photo$.subscribe((photo: any) => {
//       if (!photo) {
//         this.photoSandbox.get(parseInt(route.params.id));
//         return;
//       }
//
//       this.photoSandbox.select(photo);
//     });
//   }
// }
