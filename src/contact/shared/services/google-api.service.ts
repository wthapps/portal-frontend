import { Injectable } from '@angular/core';

import { ZContactService } from './contact.service';
import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var _: any;
declare var gapi: any;
declare var Promise: any;

@Injectable()
export class GoogleApiService {
  GoogleAuth: any;
  SCOPE: string = 'https://www.googleapis.com/auth/contacts.readonly';
  CREDENTIAL_KEYS: any = {};
  MAX_RESULTS: number = 1000;
  GCONTACT_SCOPE: string = '/m8/feeds/contacts/default/full/';

  allContactsUrl: string = 'https://www.google.com/m8/feeds/contacts/default/full';
  totalImporting: number;

  GDATA_LVL_1 : any = {
    'name': 'title.$t',
    'phones': 'gd$phoneNumber',
    'emails': 'gd$email',
    'organization': 'gd$organization',
    'addresses': 'gd$postalAddress',
    'notes': 'content.$t'
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
    },
    'addresses': {
      'category': 'rel',
      'address_line1': '$t'
    }
  };
  PARSE_FIELDS = ['rel'];


  constructor(public api: ApiBaseService,
              private contactService: ZContactService) {
    // this.handleClientLoad();
  }

  handleClientLoad() {
    // Load the API's client and auth2 modules.
    gapi.load('client:auth2', this.initClient.bind(this));
  }

  getGoogleApiConfig(): Promise<any> {
    if(_.isEmpty(this.CREDENTIAL_KEYS)) {
      return this.contactService.getGoogleApiConfig().toPromise()
        .then((res: any) => this.CREDENTIAL_KEYS = res.data);
    }
    return Promise.resolve( this.CREDENTIAL_KEYS );
  }

  initClient() {
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    this.getGoogleApiConfig().then((cre_keys: any) => {
      gapi.client.init({
        'apiKey': cre_keys.API_KEY,
        // 'discoveryDocs': [this.discoveryUrl],
        'clientId': cre_keys.CLIENT_KEY,
        'scope': this.SCOPE
      });
    }).then(() => {
      console.debug('inside initClient Promise, this: ', this);
      this.GoogleAuth = gapi.auth2.getAuthInstance();
    }).catch(err => {
      console.error(err);
    });
  }

  isSignedIn(): Promise<any> {
    if (!this.GoogleAuth.isSignedIn.get()) {
      // User is not signed in. Start Google auth flow.
      return this.GoogleAuth.signIn()
        .then(() => { return Promise.resolve(this.GoogleAuth.currentUser.get());}
        );
    } else {
      return Promise.resolve(this.GoogleAuth.currentUser.get());
    }
  }

  async startImportContact(user1?: any) {
    let user = user1 || this.GoogleAuth.currentUser.get();
    let isAuthorized = user.hasGrantedScopes(this.SCOPE);
    this.totalImporting = 0;
    console.log('user: ', user);
    if (_.get(user, 'Zi.access_token') != undefined && isAuthorized) {
      try {
        const data = await this.getGoogleContactsList(user.Zi.access_token);
        console.debug(data);
        this.totalImporting = _.get(data, 'feed.entry', []).length;
        const mapped_data = this.mappingParams(_.get(data, 'feed.entry', []));
        console.debug(mapped_data);
        const importedContacts = await this.importContactsToDb({
          import_info: {provider: 'google'},
          contacts: mapped_data
        });

        this.revokeAccess();
        return importedContacts;
      }
      catch (err) {
        this.revokeAccess();
      }
    }
    else
      throw Error(`access_token not found. Please recheck: ${user}`);
  }

  revokeAccess() {
    console.debug('revokeAccess ...');
    this.GoogleAuth.disconnect();
  }

  private async getGoogleContactsList(access_token: any) {
    try {
      const data = await gapi.client.request({
        'path': this.GCONTACT_SCOPE,
        'method': 'GET',
        'params': {
          'GData-Version': '3.0',
          'alt': 'json',
          'max-results': this.MAX_RESULTS,
          'start-index': 1,
          'Bearer': access_token}
      });
      return JSON.parse(data.body);
    } catch (err) {
      console.warn('getGoogleContactsList error', err);
    };
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

  private async importContactsToDb(json_data: any) {
    try {
      const res = await this.contactService.import(json_data).toPromise();
      console.log('import contacts to DB successfully', res);
      return res.data;
    }
    catch (err) {
      console.warn('import contacts ERRORS ', err);
    };
  }
}

