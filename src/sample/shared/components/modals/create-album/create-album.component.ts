import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'create-album',
  templateUrl: './create-album.component.html',
  styleUrls: ['./create-album.component.scss']
})
export class CreateAlbumComponent implements OnInit {

  form: FormGroup;
  name: AbstractControl;
  created_at: AbstractControl;
  description: AbstractControl;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])],
      'description': ['']
    });

    this.name = this.form.controls['name'];
    this.description = this.form.controls['description'];
  }

  ngOnInit() {
  }

}
