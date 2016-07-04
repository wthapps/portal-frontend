## Using
import {ToastsService} from '../shared/index';

constructor(private _toastsService:ToastsService) {
  this._toastsService.danger('Message');
}

## Options
###type: 
- success
- danger
- warning
- info
- bare

###override
timeOut: 0,
showProgressBar: true,
pauseOnHover: false,
clickToClose: false,
maxLength: 10

## Example
this._toastsService.danger('Message', {

  timeOut: 5000, // auto close after 5s
  showProgressBar: true,
  pauseOnHover: false,
  clickToClose: false,
  maxLength: 10

});