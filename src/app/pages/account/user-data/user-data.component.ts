import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDataForm } from 'src/app/interface/data';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {
  public userDataFormGroup!: FormGroup;
  public userData: UserDataForm = {
    name: '',
    birthdate: '',
    gender: '',
  }


  constructor() { }

  ngOnInit(): void {
    this.userDataFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      birthdate: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
    })
  }

  saveData() {
    this.userData = this.userDataFormGroup.value as UserDataForm
    console.log('####: ', this.userData)
  }

}
