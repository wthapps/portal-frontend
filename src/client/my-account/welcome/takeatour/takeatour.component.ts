import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../core/shared/services/user.service';
import { PartialsBasicInfoComponent } from '../../../core/shared/components/profile/basic-info/basic-info.component';

@Component({
  moduleId: module.id,
  selector: 'page-takeatour',
  templateUrl: 'takeatour.component.html',
  styleUrls: ['takeatour.component.css']
})

export class TakeATourComponent {
  @ViewChild('basicInfo') basicInfo: PartialsBasicInfoComponent;
  soUserProfile: Observable<any>;

  loadingTitle: string = 'Updating your profile';
  loadingContent: string = 'Your public profile will be ready in a few second.';

  step: number = 1;

  constructor(private userService: UserService) {
    this.soUserProfile = this.userService.soProfile$;
  }

  test() {
    console.log(this.basicInfo.form.value);
  }
}
