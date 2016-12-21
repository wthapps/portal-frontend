import { Component, OnInit, Input } from '@angular/core';
import { SocialService } from '../../../services/social.service';

@Component({
  moduleId: module.id,
  selector: 'z-social-privacy',
  templateUrl: 'privacy.component.html'
})

export class ZSocialPrivacyComponent implements OnInit{
  @Input() url: string;
  @Input() params: any = null;

  privacy: string = '';

  constructor(private socialService: SocialService) {}

  ngOnInit() {
    this.privacy = this.params.value;
  }

  update(privacy: string) {
    let body:any;
    if (this.params.name == 'privacy') {
      body = {privacy: privacy};
    }
    if (this.params.name == 'contact_privacy') {
      body = {contact_privacy: privacy};
    }
    if (this.params.name == 'profile_privacy') {
      body = {profile_privacy: privacy};
    }
    if (this.params.name == 'hobby_privacy') {
      body = {hobby_privacy: privacy};
    }

    this.socialService.user.update(body).subscribe(
      (res:any) => {
        console.log(res);
        if (this.params.name == 'privacy') {
          this.privacy = res.data.privacy
        }
        if (this.params.name == 'contact_privacy') {
          this.privacy = res.data.contact.privacy
        }
        if (this.params.name == 'profile_privacy') {
          this.privacy = res.data.profile_info.privacy
        }
        if (this.params.name == 'hobby_privacy') {
          this.privacy = res.data.hobby.privacy
        }

      }
    )
  }
}
