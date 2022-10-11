import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CookiesService } from '../../services/cookies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page, PageCode } from '../../interface/data';
import { environment } from '../../../environments/environment';
import { PageList, PageListWithBonus } from '../../app.constants';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ExitComponent } from '../../components/exit/exit.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { JsonrpcService, RpcService } from 'src/app/services/jsonrpc.service';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [DialogService],
})
export class AccountComponent implements OnInit {
  @Output() setUserDataOrderPage = new EventEmitter<null>();
  public refSystemId: string = '';

  constructor(
    private cookiesService: CookiesService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private jsonRpcService: JsonrpcService,
    private messageService: MessageService
  ) {}

  public currentPage!: Page;
  public handleHttpErrorFunc = this.handleHttpError.bind(this);
  private ref!: DynamicDialogRef;
  public version: string = environment.version;

  readonly PageCode = PageCode;
  readonly pageList = environment.hasBonusProgram
    ? PageListWithBonus
    : PageList;

  ngOnInit(): void {
    if (!this.getToken()) {
      this.currentPage = this.pageList[0];
    } else {
      this.route.queryParams.subscribe((params) => {
        if (!params['activePage']) {
          this.currentPage = this.pageList[1];
          return;
        }
        const currentPage = this.pageList.find((page) => {
          return page.code === Number(params['activePage']);
        });
        if (!currentPage) {
          this.currentPage = this.pageList[1];
        } else {
          this.currentPage = currentPage;
        }
      });
    }
    document.body.classList.add(
      'woocommerce-account',
      'woocommerce-page',
      'woocommerce-orders'
    );
  }

  phoneConfirmed(): void {
    this.refSystem();
    this.currentPage = this.pageList[1];
  }

  async refSystem() {
    const additionalInfo = (await lastValueFrom(
    this.jsonRpcService.rpc({
      method: 'getAdditionalInfo',
      params: []
    }, RpcService.authService, true)
    )).data
    this.route.queryParams.subscribe((params) => {
      console.log('####: ', params)
      if (params['refUserId']) {
        if (additionalInfo.refSystem?.code.length) {
          this.messageService.add({
            severity: 'custom',
            summary:
              'Вы уже зарегестрированы в реферальной программе!',
          });
          return;
        }
        this.refSystemId = params['refUserId'];
        this.jsonRpcService
          .rpc(
            {
              method: 'updateAdditionalInfo',
              params: [
                {
                  refSystem: {
                    code: this.refSystemId,
                  },
                },
              ],
            },
            RpcService.authService,
            true
          )
          .subscribe({
            next: () => {
              this.router.navigate([], {
                queryParams: {
                  refUserId: null,
                },
                queryParamsHandling: 'merge',
              });
              this.messageService.add({
                severity: 'custom',
                summary:
                  'Регистрация прошла успешна! Бонусы скоро будут начислены',
              });
            },
            error: (err) => {
              console.error('Error: ', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Произошла ошибка, попробуйте позже',
              });
            },
          });
      }
    });
  }

  changePage(event: MouseEvent, page: Page): void {
    event.preventDefault();
    this.currentPage = page;
    // let params = new HttpParams();
    // params = params.append('activePage', this.currentPage.code);
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        activePage: this.currentPage.code,
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      // skipLocationChange: true
      // do not trigger navigation
    });
  }

  handleHttpError(error: HttpErrorResponse): void {
    if (error.status === 500) {
      this.logout();
    }
  }

  setToken(token: string): void {
    this.cookiesService.setCookie('token', token);
  }

  getToken(): string | void {
    return this.cookiesService.getItem('token');
  }

  deleteToken(): void {
    this.cookiesService.deleteCookie('token');
    // this.router.navigate(['.'], {
    //   queryParams: {},
    // });
  }

  logout(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    this.ref = this.dialogService.open(ExitComponent, {
      width: 'auto',
      style: {
        'max-width': '90vw',
        'max-height': '90vh',
      },
      contentStyle: {
        'max-height': '90vh',
        height: 'auto',
        'max-width': '90vw',
        overflow: 'auto',
        'border-radius': '4px',
      },
      baseZIndex: 10000,
      autoZIndex: true,
      dismissableMask: true,
      closeOnEscape: true,
      showHeader: false,
    });
    this.ref.onClose.subscribe((result) => {
      if (result) {
        this.deleteToken();
        this.currentPage = this.pageList[0];
      }
    });
  }
}
