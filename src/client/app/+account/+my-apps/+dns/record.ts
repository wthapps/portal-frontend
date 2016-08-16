export class Record {
  id: number;
  uuid: string;
  name: string;
  content: string;
  record_type: string;
  created_at: string;
  updated_at: string;

  constructor(fields?: {
    id?: number,
    uuid?: string,
    name?: string,
    content?: string,
    record_type?: string,
    created_at?: string,
    updated_at?: string,
  }) {
    if (fields) Object.assign(this, fields);
  }
}
