import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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
  @Output() phoneConfirmed = new EventEmitter<null>();
  public phone: string = '';
  public isCodeConfirm = false;
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
  ) {
  }

  getCode(event: any): void {
    event.preventDefault();
    this.loading = true;
    this.phoneToConfirm = '+' + this.phone.replace(/\D/g, '');
    if (this.timeLeft) {
      this.messageService.add({
        severity: 'custom',
        summary: `Отправить повторно можно через ${this.timeLeft}с`,
      });
      this.loading = false;
      return;
    }
    this.jsonrpc.rpc({
      method: 'sendVerifyByPhone',
      params: [this.phoneToConfirm]
    }, RpcService.authService, false).subscribe({
        next: (result) => {
          if (result.code === -1) {
            this.messageService.add({
              severity: 'error',
              summary: 'Произошла ошибка, попробуйте позже!',
            });
          }
          if (result.code === 0) {
            this.isCodeConfirm = true;
            this.timeLeft = 60;
            const interval = setInterval(() => {
              if(this.timeLeft > 0) {
                this.timeLeft--;
              } else {
                clearInterval(interval);
              }
            },1000)
          }
          this.loading = false;
        },
        error: this.handleHttpError
      }
    );
  }

  confirmCode(event: SubmitEvent): void {
    event.preventDefault();
    this.jsonrpc.rpc({
      method: 'getTokenByPhone',
      params: [this.phoneToConfirm, String(this.code)]
    }, RpcService.authService, false).subscribe({
        next: (result) => {
          if (result.code === 0) {
            this.cookiesService.setCookie('token', result?.data?.token);
            // this.router.navigate(['/auth'], {
            //   queryParams: {
            //     token: result?.data?.token
            //   },
            // });
            this.phoneConfirmed.emit(null);
          } else {
            this.errorConfirmCode = true;
          }
        },
        error: this.handleHttpError
      }
    );
  }

}
