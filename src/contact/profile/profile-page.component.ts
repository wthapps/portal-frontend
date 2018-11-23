import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CardService } from '../card';

@Component ({
  selector: 'w-user-profile-page',
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  cards$: Observable<Array<any>>;
  
  constructor(private cardService: CardService) {
    this.cards$ = this.cardService.getItems();
  }
  
  ngOnInit(): void {
    this.cardService.getCards();
  }
}
