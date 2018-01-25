// import { Store }            from '@ngrx/store';
// import * as storeCore           from '@core/store';
// import { Observable } from 'rxjs/Observable';
//
// export abstract class Sandbox {
//
//   loggedUser$: Observable<any> = this.appStateCore$.select(storeCore.getLoggedUser);
//   // public culture$:    Observable<any> = this.appState$.select(store.getSelectedCulture);
//   culture:     string;
//
//   constructor(protected appStateCore$: Store<storeCore.State>) {}
//
//   // /**
//   //  * Pulls user from local storage and saves it to the store
//   //  */
//   // public loadUser(): void {
//   //   var user = JSON.parse(localStorage.getItem('currentUser'));
//   //   this.appState$.dispatch(new authActions.AddUserAction(new User(user)));
//   // }
//   //
//   // /**
//   //  * Formats date string based on selected culture
//   //  *
//   //  * @param value
//   //  */
//   // public formatDate(value: string) {
//   //   return localeDateString(value, this.culture);
//   // }
// }
