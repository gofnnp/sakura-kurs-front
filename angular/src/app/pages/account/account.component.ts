import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CookiesService } from '../../services/cookies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MainPageCode, Page, PageCode } from '../../interface/data';
import { environment } from '../../../environments/environment';
import { PageList, PageListMain, PageListWithBonus } from '../../app.constants';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ExitComponent } from '../../components/exit/exit.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { JsonrpcService, RpcService } from 'src/app/services/jsonrpc.service';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [DialogService],
})
export class AccountComponent implements OnInit {
  @Output() setUserDataOrderPage = new EventEmitter<null>();
  @ViewChild('menu', { static: true}) menu!: ElementRef;
  public refSystemId: string = '';

  constructor(
    private cookiesService: CookiesService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private jsonRpcService: JsonrpcService,
    private messageService: MessageService,
    private cartService: CartService,
  ) { }

  public currentPage!: Page;
  public handleHttpErrorFunc = this.handleHttpError.bind(this);
  private ref!: DynamicDialogRef;
  public version: string = environment.version;

  readonly PageCode = PageCode;
  readonly pageList = environment.hasBonusProgram
    ? PageListWithBonus
    : PageList;

  readonly MainPageCode = MainPageCode;
  readonly mainPageList = PageListMain;
  public currentPageMain: Page = this.mainPageList[environment.production ? 1 : 1];
  public cartCount = 0;
  public showAuthoriztion = false;

  ngOnInit(): void {

    this.checkAuthorization(true)
    this.currentPage = this.pageList[0];
    document.body.classList.add(
      'woocommerce-account',
      'woocommerce-page',
      'woocommerce-orders'
    );
    this.route.queryParams.subscribe((params) => {
      if (!params['activeAccountPage']) {
        this.currentPage = this.pageList[0];
        return;
      }
      const currentPage = this.pageList.find((page) => {
        return page.code === Number(params['activeAccountPage']);
      });
      if (!currentPage) {
        this.currentPage = this.pageList[0];
      } else {
        this.currentPage = currentPage;
      }
    });
    this.cartCount = this.cartService.cartCount;
    this.cartService.cartCount$.subscribe({
      next: (count) => {
        this.cartCount = count;
        document.querySelectorAll('.cart')[0].setAttribute("data-counter", this.cartCount.toString())
      }
    });
  }

  loginConfirmed(): void {
    // this.refSystem();
    this.showAuthoriztion = false
    this.router.navigate(['/account'], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
    this.checkAuthorization(true)
  }

  async refSystem() {
    const additionalInfo = (await lastValueFrom(
      this.jsonRpcService.rpc({
        method: 'getAdditionalInfo',
        params: []
      }, RpcService.authService, true)
    )).data
    this.route.queryParams.subscribe((params) => {
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

  logOut() {
    this.cookiesService.deleteCookie('token')
    this.router.navigate(['/account/auth'], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }

  changeMainPage(page: Page, event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
    this.currentPageMain = page;
    this.router.navigate(['.'], {
      relativeTo: this.route,
      // queryParams: {
      //   activePage: this.currentPage.code,
      // },
      queryParamsHandling: 'merge',
    });
    this.checkAuthorization(true)
    if (this.currentPageMain === this.mainPageList[2]) {
      this.checkAuthorization(false)
    }
    this.menu.nativeElement.setAttribute('isShow', 'false')
  }

  changePage(page: Page, event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
    this.currentPage = page;
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        activeAccountPage: this.currentPage.code,
      },
      queryParamsHandling: 'merge',
    });
  }

  checkAuthorization(showAuthoriztion: boolean, forced = false) {
    if (!this.getToken() || forced) {
      this.showAuthoriztion = showAuthoriztion
    }
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

  onReject() {
    this.messageService.clear('c');
  }

  onConfirm() {
    this.deleteToken();
    this.showAuthoriztion = true;
    this.messageService.clear('c')
  }

  logout(event?: MouseEvent) {
    if (event) {
      event.preventDefault()
    }
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Вы уверены, что хотите выйти?' });
  }
}
