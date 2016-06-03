export class IRecord {
  id:         number;
  domain_id:  number;
  name:       string;
  content:    string;
  ttl:        number;
  priority:   number;
  type:       string;
  updated_at: Date;
  created_at: Date;
}

export class Type {
  value: string;
  name: string;
}
