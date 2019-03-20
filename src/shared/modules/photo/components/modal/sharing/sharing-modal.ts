// Ex: {"role_id"=>1, "objects"=>[{"id"=>527, "object_type"=>"Media::Photo"}], "recipients"=>[7]}
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
  role_id: any;
  recipient_id?: number;
  recipient_type?: string;
  _destroy?: boolean;
  user?: any;
}
export interface SharingCreateParams {
  objects: Array<{ id, model }>;
  recipients: Array<SharingRecipient>;
  role_id: any;
}
export interface SharingEditParams {
  recipients: Array<SharingRecipient>;
  users: Array<SharingRecipient>;
  id: number;
}
export interface SharingModalResult {
  recipients: Array<SharingRecipient>;
  users: Array<SharingRecipient>;
  role: any;
}
