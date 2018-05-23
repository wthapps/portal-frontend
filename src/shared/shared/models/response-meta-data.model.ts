export interface ResponseMetaDataPageLink {
  first: string;
  last: string;
  next: string;
  previous: string;
  self: string;
}

export interface ResponseMetaDataPage {
  links: ResponseMetaDataPageLink;
  page: number;
  page_count: number;
  per_page: number;
  total: number;
}

export class ResponseMetaData {
  data: any;
  page_metadata: ResponseMetaDataPage;
  success: boolean;

  constructor(fields: {
    data?: any,
    page_metadata?: ResponseMetaDataPage,
    success?: boolean,
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
