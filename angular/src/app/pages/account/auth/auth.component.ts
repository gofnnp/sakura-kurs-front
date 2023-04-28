import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { CookiesService } from 'src/app/services/cookies.service';
import { FormatPhoneService } from 'src/app/services/format-phone.service';
import { JsonrpcService, RpcService } from 'src/app/services/jsonrpc.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  @Input() handleHttpError!: (error: HttpErrorResponse) => void;
  @Output() loginConfirmed = new EventEmitter<null>();
  public authFrom = new FormGroup({
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    password: new FormControl<string>('', [Validators.minLength(4), Validators.required])
  });
  public signUpForm = new FormGroup({
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    password: new FormControl<string>('', [Validators.minLength(4), Validators.required]),
    name: new FormControl<string>('')
  });
  public phone: string = '';
  public isShowAuth = true
  public code: string = '';
  public phoneToConfirm!: string;
  public loading = false;
  public errorConfirmCode: boolean = false;
  timeLeft: number = 0;

  constructor(
    private phoneFormatter: FormatPhoneService,
    private jsonrpc: JsonrpcService,
    private cookiesService: CookiesService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private api: ApiService
  ) {
  }

  logIn(): void {
    this.loading = true;
    const data = this.authFrom.value
    this.api.signIn(data.email || '', data.password || '').subscribe({
      next: (value) => {
        this.cookiesService.setCookie('token', value.values.token.split(' ')[1])
        this.loading = false
        this.loginConfirmed.emit(null);
      },
      error: (err) => {
        console.log('Error: ', err);
        
        this.messageService.add({
          severity: 'error',
          summary: err.error.values.message
        })
        this.loading = false
      }
    })
  }

  signUp() {
    this.loading = true;
    const data = this.signUpForm.value
    this.api.signUp(data.email || '', data.password || '', data.name || '').subscribe({
      next: (value) => {
        this.cookiesService.setCookie('token', value.values.token)
        this.loading = false
        this.loginConfirmed.emit(null);
      },
      error: (err) => {
        console.log('Error: ', err);
        
        this.messageService.add({
          severity: 'error',
          summary: err.error.values.message
        })
        this.loading = false
      }
    })
  }

  changePage(name: string) {
    this.isShowAuth = name === 'reg' ? false : true
  }

  // confirmCode(event: SubmitEvent): void {
  //   event.preventDefault();
  //   this.jsonrpc.rpc({
  //     method: 'getTokenByPhone',
  //     params: [this.phoneToConfirm, String(this.code)]
  //   }, RpcService.authService, false).subscribe({
  //       next: (result) => {
  //         if (result.code === 0) {
  //           this.cookiesService.setCookie('token', result?.data?.token);
  //           // this.router.navigate(['/auth'], {
  //           //   queryParams: {
  //           //     token: result?.data?.token
  //           //   },
  //           // });
  //           this.phoneConfirmed.emit(null);
  //         } else {
  //           this.errorConfirmCode = true;
  //         }
  //       },
  //       error: this.handleHttpError
  //     }
  //   );
  // }

}
