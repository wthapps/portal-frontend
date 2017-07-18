import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { Label } from './label.model';
import { BaseEntityService } from '../../core/shared/services/base-entity-service';

declare let _ : any;
@Injectable()
export class LabelService extends BaseEntityService<Label> {

  private labels: Array<any> = new Array<any>();

  constructor(protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
    this.url = 'contact/labels';
  }

  getAllLabels(): Promise<any> {
    if(_.isEmpty(this.labels))
      return this.getAll().toPromise().then((res: any) => {this.labels.push(...res.data); return this.labels;});

    return Promise.resolve(this.labels);
  }
}
