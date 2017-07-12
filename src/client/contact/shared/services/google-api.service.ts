
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Response, Http } from '@angular/http';
import { ZContactService } from './contact.service';

declare var _: any;
declare var gapi: any;

@Injectable()
export class GoogleApiService {
  GoogleAuth: any;
  SCOPE: string = 'https://www.googleapis.com/auth/contacts.readonly';
  API_KEY: string = 'AIzaSyBATa8fWBJz-ZH8UCscn0PEdC03-ng5bn8';
  CLIENT_KEY: string = '764809689102-jjug0itrqj9qts1mv7vj1r6e7v6qrrhv.apps.googleusercontent.com';

  allContactsUrl: string = 'https://www.google.com/m8/feeds/contacts/default/full';

  GDATA_LVL_1 : any = {
    'name': 'title.$t',
    'phones': 'gd$phoneNumber',
    'emails': 'gd$email',
    'organization': 'gd$organization',
    'postalAddress': 'gd$postalAddress'
  };


  GDATA_LVL_2: any = {
    'phones' : {
      'type': 'rel',
      'value': '$t',
      'primary': 'primary'
    },
    'emails': {
      'type': 'rel',
      'value': 'address',
      'primary': 'primary'
    }
  };

  // "http://schemas.google.com/g/2005#mobile" => "mobile"
  PARSE_FIELDS = ['rel'];


  constructor(public http: Http,
              private contactService: ZContactService) {
    this.handleClientLoad();
  }

  handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', this.initClient.bind(this));
  }

  initClient() {
    // Retrieve the discovery document for version 3 of Google Drive API.
    // In practice, your app can retrieve one or more discovery documents.

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    console.debug('inside initClient, this: ', this);
    gapi.client.init({
      'apiKey': this.API_KEY,
      // 'discoveryDocs': [this.discoveryUrl],
      'clientId': this.CLIENT_KEY,
      'scope': this.SCOPE
    }).then(() => {
      console.debug('inside initClient Promise, this: ', this);
      this.GoogleAuth = gapi.auth2.getAuthInstance();

      // // Listen for sign-in state changes.
      // this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus.bind(this));
      //
      // // Handle initial sign-in state. (Determine if user is already signed in.)
      // var user = this.GoogleAuth.currentUser.get();
      // user.grant({'scope': this.allContactsUrl});

    });
  }

  importContact() {
    if (this.GoogleAuth.isSignedIn.get()) {
      // // User is authorized and has clicked 'Sign out' button.

      // this.GoogleAuth.signOut();
      console.log('GoogleAuth signout-ing: ', this.GoogleAuth);
    } else {
      // User is not signed in. Start Google auth flow.
      this.GoogleAuth.signIn();
      console.log('GoogleAuth signining: ', this.GoogleAuth);
    }

    let user = this.GoogleAuth.currentUser.get();
    let isAuthorized = user.hasGrantedScopes(this.SCOPE)
    console.log('user: ', user);
    if (_.get(user, 'Zi.access_token') != undefined && isAuthorized)
      this.getContactsList(user.Zi.access_token);
  }

  revokeAccess() {
    this.GoogleAuth.disconnect();
  }

  getContactsList(access_token: any) {
    gapi.client.request({
      'path': '/m8/feeds/contacts/default/full/?max-result=1000&start-index=1',
      'method': 'GET',
      'params': {
        'GData-Version': '3.0',
        'alt': 'json',
        'max-result': 1000,
        'start-index': 2,
        'Bearer': access_token}
    })
      // .then((data: any) => { return JSON.parse(data);})
      .then((data: any) => JSON.parse(data.body))
      .then((data: any) => {
      console.log('client request result: ', data);
      let mapped_data = this.mappingParams(data.feed.entry);
      return mapped_data;
    }).then((mapped_data: any) => this.importContactsToDb({'contacts': mapped_data}));
  }

  // Convert Google API params to comply WTH API format and filter out unnecessary data
  private mappingParams(entries: any) {
    let rs = [];
    for(let i = 0; i < entries.length; i++) {
      let h: any = {};
      let data = entries[i];
      _.each(this.GDATA_LVL_1, (v: any, k: any) => {

        let go = _.get(this.GDATA_LVL_2, k);

        if(go !== undefined && data[v] && data[v].constructor == Array) {
          // Map 2nd level data
          for(let j = 0; j < data[v].length; j++) {
            _.each(go, (gv: any, gk: any) => {
              _.set(h, `${k}[${j}][${gk}]`, this.parseRel(_.get(data,`${v}[${j}][${gv}]`), gv));
            });
          }
        } else {
          // Map 1st level data
          _.set(h, k, _.get(data, v));
        }
      });

      rs.push(h);
      if ( _.get(data, 'emails') != undefined)
        console.debug('h data: ', data, h);
    }
    return rs;
  }

  // Ex: "http://schemas.google.com/g/2005#mobile" => 'mobile'
  parseRel(data: string, field: string) {
    if(_.indexOf(this.PARSE_FIELDS, field) > -1)
      return data.split('#')[1];
    else
      return data;
  }

  private importContactsToDb(json_data: any) {
    this.contactService.importGoogleContacts(json_data).toPromise()
      .then((res: any) => console.log('import contacts to DB successfully', res))
      .catch((err: any) => console.error('import contacts ERRORS ', err));
  }


}

