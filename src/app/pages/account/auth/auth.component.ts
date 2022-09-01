import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private phoneFormatter: FormatPhoneService,
    private jsonrpc: JsonrpcService,
    private cookiesService: CookiesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  getCode(event: SubmitEvent): void {
    event.preventDefault();
    this.loading = true;
    this.phoneToConfirm = '+7' + this.phone.replace(/\D/g, '');
    this.jsonrpc.rpc({
      method: 'sendVerifyByPhone',
      params: [this.phoneToConfirm]
    }, RpcService.authService, false).subscribe({
        next: (result) => {
          if (result.code === 0) {
            this.isCodeConfirm = true;
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
      params: [this.phoneToConfirm, this.code]
    }, RpcService.authService, false).subscribe({
        next: (result) => {
          if (result.code === 0) {
            this.cookiesService.setCookie('token', result?.data?.token);
            this.router.navigate(['/auth'], {
              queryParams: {
                token: result?.data?.token
              },
            });
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
