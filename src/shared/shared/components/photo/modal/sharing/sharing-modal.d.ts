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
  role_id: number;
  recipient_id?: number;
  recipient_type?: string;
  user?: any;
}
interface SharingCreateParams {
  objects: Array<{ id, model }>[];
  recipients: Array<{ role_id, recipient_id }>[];
  role_id: number;
}
