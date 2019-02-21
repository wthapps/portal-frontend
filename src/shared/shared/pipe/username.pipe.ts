import { UserService } from './../../services/user.service';
import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models';

/*
 * Changes the case of the first letter of a given number of words in a string.
 */

@Pipe({ name: 'username' })
export class UsernamePipe implements PipeTransform {
  currentUser: User;

  constructor(private userService: UserService) {
    this.currentUser = userService.getSyncProfile();
  }

  transform(user): string {
    return user.uuid === this.currentUser.uuid ? 'me' : user.name;
  }
}
