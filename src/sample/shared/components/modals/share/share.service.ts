import { Injectable } from '@angular/core';
import { ApiBaseService } from '@shared/services';

@Injectable()
export class WModalsShareService {

  constructor(private api: ApiBaseService) {
  }

  getRoles(module_name: string) { // Media
    return this.api.get('common/roles', { module_name });
  }
}
