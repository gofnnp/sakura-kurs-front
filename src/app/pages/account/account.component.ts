import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {CookiesService} from "../../services/cookies.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Page, PageCode} from "../../interface/data";
import {environment} from "../../../environments/environment";
import {PageList, PageListWithBonus} from "../../app.constants";
import {HttpErrorResponse} from "@angular/common/http";
import {ExitComponent} from "../../components/exit/exit.component";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers:[DialogService],
})
export class AccountComponent implements OnInit {
  @Output() setUserDataOrderPage = new EventEmitter<null>();

  constructor(
    private cookiesService: CookiesService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
  ) {}

  public currentPage!: Page;
  public handleHttpErrorFunc = this.handleHttpError.bind(this);
  private ref!: DynamicDialogRef;

  readonly PageCode = PageCode;
  readonly pageList = environment.hasBonusProgram ? PageListWithBonus : PageList;

  ngOnInit(): void {
    this.currentPage = this.getToken() ? this.pageList[1] : this.pageList[0];
    document.body.classList.add('woocommerce-account', 'woocommerce-page', 'woocommerce-orders');
  }

  phoneConfirmed(): void{
      this.currentPage = this.pageList[1];
  }

  changePage(event: MouseEvent, page: Page): void{
    event.preventDefault();
    this.currentPage = page;
  }

  handleHttpError(error: HttpErrorResponse): void {
    if (error.status === 500) {
      this.logout();
    }
  }

  setToken(token: string): void{
    this.cookiesService.setCookie('token', token);
  }

  getToken(): string|void{
    return  this.cookiesService.getItem('token');
  }

  deleteToken(): void{
    this.cookiesService.deleteCookie('token');
    this.router.navigate([''], {
      queryParams: {},
    });
  }

  logout(event?: MouseEvent){
    if(event){
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
    this.ref.onClose.subscribe(
      result => {
        if (result) {
          this.currentPage = this.pageList[0];
          this.deleteToken();
        }
      }
    );
  }

}
