// Ex: {"role_id"=>1, "objects"=>[{"id"=>527, "object_type"=>"photo"}], "recipients"=>[7]}
export interface CreateCommonSharing {
  // role id mean you share with permission
  role_id: number;
  // which object you want to share
  objects: Array<{ id: any, object_type: any }>;
  // Recipients ids you want to share
  recipients: Array<number>;
}

export interface SharingModalOptions { sharingRecipients: Array<any> }
export interface SharingRecipient {
  id?: number;
  role_id: number;
  recipient_id?: number;
  recipient_type?: string;
  _destroy?: boolean;
  user?: any;
}
interface SharingCreateParams {
  objects: Array<{ id, model }>;
  recipients: Array<SharingRecipient>;
  role_id: any;
}
interface SharingEditParams {
  recipients: Array<SharingRecipient>;
  users: Array<SharingRecipient>;
  id: number;
}
interface SharingModalResult {
  recipients: Array<SharingRecipient>;
  users: Array<SharingRecipient>;
  role: any;
}
