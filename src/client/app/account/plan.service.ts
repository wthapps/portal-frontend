import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {ApiBaseService} from '../shared/services/apibase.service';

@Injectable()
export class PlanService extends ApiBaseService{

  constructor(http: Http){
    super(http);
  }

  

  public list(path: string): Observable<Response>{    
    return super.get(path)
      .map(res => res.json())
      .map((res) => {
        if(res){
        }        
        return res;
      });
  }

  // public get(path: string): Observable<Response>{
  //   return super.get(path)
  //     .map(res => res.json())
  //     .map((res) => {
  //       if(res){
  //       }
  //       return res;
  //     });
  // }
}
