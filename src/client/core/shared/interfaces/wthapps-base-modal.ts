export interface WthAppsBaseModal {

  /*
  * This event should be in format
  * action: string -> action name
  * payload: json object -> data
  * */
  event: any;

  open(options?: any): void;
  close(options?: any): void;

}
