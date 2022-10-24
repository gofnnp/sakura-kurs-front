import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { UserDataForm } from 'src/app/interface/data';
import { AppleWalletService } from 'src/app/services/apple-wallet.service';
import { JsonrpcService, RpcService } from 'src/app/services/jsonrpc.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {
  public userDataFormGroup!: FormGroup;
  public userData: UserDataForm = {
    first_name: '',
    birthdate: '',
    gender: '',
  }


  constructor(
    private jsonRpcService: JsonrpcService,
    private messageService: MessageService,
    private appleWallet: AppleWalletService,
    private jsonrpc: JsonrpcService,
  ) { }

  ngOnInit(): void {
    this.createUserDataForm({...this.userData})
    this.jsonRpcService.rpc({
      method: 'getAdditionalInfo',
      params: []
    }, RpcService.authService, true).subscribe({
      next: (res) => {
        const { first_name, birthdate, gender } = res.data
        this.userData = { first_name, birthdate, gender }
        this.createUserDataForm({...this.userData})
      },
      error: (err) => {
        console.error('Error: ', err)
      }
    });

  }

  createUserDataForm(val: UserDataForm) {
    this.userDataFormGroup = new FormGroup({
      first_name: new FormControl(val.first_name, [Validators.required, Validators.minLength(2)]),
      birthdate: new FormControl(val.birthdate, [Validators.required]),
      gender: new FormControl(val.gender ? val.gender : '', [Validators.required]),
    })
  }

  saveData() {
    if (this.userDataFormGroup.invalid) {
      this.markFormGroupTouched(this.userDataFormGroup)
      return
    }
    this.userData = this.userDataFormGroup.value as UserDataForm
    this.jsonRpcService.rpc({
      method: 'updateAdditionalInfo',
      params: [this.userData]
    }, RpcService.authService, true).subscribe({
      next: async () => {
        this.messageService.add({severity:'custom', summary:'Данные успешно обновлены!'});
        const accountData = (await lastValueFrom(
          this.jsonrpc
            .rpc(
              {
                method: 'getTokenData',
                params: [],
              },
              RpcService.authService,
              true
            )
        )).data
        if (accountData.user_id) {
          this.appleWallet.reloadCard(accountData.user_id).subscribe({
            next: (value) => {
            },
            error: (err) => {
              console.error(err);
            }
          })
        }
      },
      error: (err) => {
        console.error('Error: ', err)
        this.messageService.add({severity:'error', summary:'Произошла ошибка, попробуйте позже'});        
      }
    })
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: FormControl) => {
      control.markAsDirty();
    });
  }
}
