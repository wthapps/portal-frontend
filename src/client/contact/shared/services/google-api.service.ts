
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Response, Http } from '@angular/http';
import { ZContactService } from './contact.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

declare var _: any;
declare var gapi: any;

@Injectable()
export class GoogleApiService {
  GoogleAuth: any;
  SCOPE: string = 'https://www.googleapis.com/auth/contacts.readonly';
  CREDENTIAL_KEYS: any = {};
  MAX_RESULTS: number = 1000;
  GCONTACT_SCOPE: string = '/m8/feeds/contacts/default/full/';

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
      'category': 'rel',
      'value': '$t',
      'primary': 'primary'
    },
    'emails': {
      'category': 'rel',
      'value': 'address',
      'primary': 'primary'
    }
  };
  PARSE_FIELDS = ['rel'];


  constructor(public api: ApiBaseService,
              private contactService: ZContactService) {
    this.handleClientLoad();
  }

  handleClientLoad() {
    // Load the API's client and auth2 modules.
    gapi.load('client:auth2', this.initClient.bind(this));
  }

  getGoogleApiConfig(): Promise<any> {
    if(_.isEmpty(this.CREDENTIAL_KEYS)) {
      return this.contactService.getGoogleApiConfig().toPromise().then((res: any) => this.CREDENTIAL_KEYS = res.data);
    }
    return Promise.resolve( this.CREDENTIAL_KEYS );
  }

  initClient() {
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    console.debug('inside initClient, this: ', this);
    this.getGoogleApiConfig().then((cre_keys: any) => {
      gapi.client.init({
        'apiKey': cre_keys.API_KEY,
        // 'discoveryDocs': [this.discoveryUrl],
        'clientId': cre_keys.CLIENT_KEY,
        'scope': this.SCOPE
      })
    }).then(() => {
      console.debug('inside initClient Promise, this: ', this);
      this.GoogleAuth = gapi.auth2.getAuthInstance();
    });
  }

  isSignedIn(): Promise<any> {
    return new Promise<any>((resolve: any) => {
      if (!this.GoogleAuth.isSignedIn.get()) {
        // User is not signed in. Start Google auth flow.
        this.GoogleAuth.signIn()
          .then(() => {
            let user = this.GoogleAuth.currentUser.get();
            resolve(user);
        })
      } else {
        let user = this.GoogleAuth.currentUser.get();
        resolve(user);
      }
    });
  }

  startImportContact(user: any): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      let user = this.GoogleAuth.currentUser.get();
      let isAuthorized = user.hasGrantedScopes(this.SCOPE)
      console.log('user: ', user);
      if (_.get(user, 'Zi.access_token') != undefined && isAuthorized)
        this.getGoogleContactsList(user.Zi.access_token)
          .then((data: any) => {
            console.log('client request result: ', data);
            return this.mappingParams(_.get(data, 'feed.entry', []));
          })
          .then((mapped_data: any) => { return this.importContactsToDb({contacts: mapped_data}); })
          .then((data: any) => { this.revokeAccess() ; resolve(data)});
      else
        reject(new Error(`access_token not found. Please recheck: ${user}`));
    });
  }

  revokeAccess() {
    this.GoogleAuth.disconnect();
  }

  private getGoogleContactsList(access_token: any): Promise<any> {
    return gapi.client.request({
      'path': this.GCONTACT_SCOPE,
      'method': 'GET',
      'params': {
        'GData-Version': '3.0',
        'alt': 'json',
        'max-results': this.MAX_RESULTS,
        'start-index': 1,
        'Bearer': access_token}
    })
      .then((data: any) => JSON.parse(data.body));
  }

  // Convert Google API params to comply WTH API format and filter out unnecessary data
  private mappingParams(entries: any): any {
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
  private parseRel(data: string, field: string) {
    if(data != undefined && _.indexOf(this.PARSE_FIELDS, field) > -1)
      return data.split('#')[1];
    else
      return data;
  }

  private importContactsToDb(json_data: any): Promise<any> {
    return this.contactService.importGoogleContacts(json_data).toPromise()
      .then((res: any) => { console.log('import contacts to DB successfully', res); return res.data;})
      .catch((err: any) => console.error('import contacts ERRORS ', err));
  }


}

