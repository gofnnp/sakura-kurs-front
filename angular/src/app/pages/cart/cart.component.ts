import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { SnackBarComponent } from 'src/app/components/snack-bar/snack-bar.component';
import { Order } from 'src/app/models/order';
import { OrderProduct } from 'src/app/models/order-product';
import { ApiService } from 'src/app/services/api.service';
import {
  CartService,
  ProductAmountAction,
} from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  @Output() showAuthoriztion = new EventEmitter<boolean>();
  public loading = false;
  public orderConfirmed = false;
  public order!: Order;
  public price!: number;
  public visibleSidebar: boolean = false;
  public isFullScreen!: boolean;
  public width!: number;
  public isAuth = false

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private messageService: MessageService,
    private _snackBar: MatSnackBar,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.width = window.innerWidth;
    this.changeDullScreenMode();
    this.loadCart();
  }

  // Изменение размера окна
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.width = event.target.innerWidth;
    this.changeDullScreenMode();
  }

  toggleSideBar(): void {
    this.visibleSidebar = !this.visibleSidebar;
    this.orderConfirmed = false;
    this.loadCart();
  }

  hide() {
    this.orderConfirmed = false;
  }

  changeDullScreenMode() {
    if (this.width < 650) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  async loadCart(): Promise<void> {
    this.loading = true;
    this.order = await this.orderService.getOrder(true);
    if (this.order) this.price = this.order.price;
    
    if (this.order?.userData?.errorCode) {
      // this._snackBar.open('Вы не авторизованы!', 'Ок')
      this.isAuth = false
    } else {
      this.isAuth = true
    }
    this.loading = false;
  }

  userNotFound(event: null = null) {
    this.visibleSidebar = false
    this._snackBar.open('Пользователь не найден в системе! Обратитесь к руководству', 'Ок')
  }

  removeFromCart(event: Event, guid: string): void {
    event.preventDefault();
    this.orderService.removeFromCart(guid);
  }

  loginConfirmed() {
    this.loadCart()
  }

  confirmOrder(event: Event): void {
    event.preventDefault();
    this.api.addOrder(this.order.products).subscribe({
      next: (value) => {
        const orderId = value.values.results.insertId
        this.orderSubmitted(orderId)
        this.cartService.clearCart();
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Произошла ошибка! Попробуйте позже'
        })
        
      }
    })
    
    // this.showAuthoriztion.emit(true);
    // this.orderConfirmed = true;
    // this.confirm.emit();
  }

  setAmount(product: OrderProduct, method: 'plus' | 'minus') {
    if (method === 'plus') {
      this.cartService.changeAmountProduct(
        product.guid,
        ProductAmountAction.increment
      );
      product.amount++;
      this.price = this.price + Number(product.price);
    } else if (method === 'minus' && product.amount > 1) {
      this.cartService.changeAmountProduct(
        product.guid,
        ProductAmountAction.decrement
      );
      product.amount--;
      this.price = this.price - Number(product.price);
    }
  }

  orderSubmitted(orderid: number) {
    this.visibleSidebar = false;
    this._snackBar.open(`Заказ оформлен! Номер заказа: ${orderid}`, 'Ок')
  }

  confirmClearCart() {
    const snackBar = this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 4000,
      data: {
        text: 'Очистить корзину?',
      },
    });
    snackBar.afterDismissed().subscribe(({ dismissedByAction }) => {
      if (dismissedByAction) {
        this.cartService.clearCart();
        this.loadCart();
        this.visibleSidebar = false;
      }
    });
  }
}
