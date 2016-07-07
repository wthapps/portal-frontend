## Using
import {LoadingService} from '../shared/index';

constructor(private _loadingService:LoadingService) {
}

## Start
this._loadingService.start(); // loading fullpage
this._loadingService.start('#example');
this._loadingService.start('.example');

## Stop
this._loadingService.stop();
this._loadingService.stop('#example');
this._loadingService.stop('.example');
