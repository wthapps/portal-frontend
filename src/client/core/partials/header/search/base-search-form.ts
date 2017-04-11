import { ServiceManager } from '../../../shared/services/service-manager';

declare let _:any;

export abstract class BaseSearchForm {
  searchText: any; // Text to search
  suggestions:any; // Array suggestion
  active: any;    // Show or hide Search
  searchAdvanced: boolean; // Show or hide search Advanced

  constructor() {

  }
}
