import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/models/order';
import { OrderProduct } from 'src/app/models/order-product';
import { CartService, ProductAmountAction } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
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

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.width = window.innerWidth;
    this.changeDullScreenMode()
    this.loadCart()
  }

  // Изменение размера окна
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
      this.width = event.target.innerWidth;
      this.changeDullScreenMode()
  }

  toggleSideBar(): void{
    this.visibleSidebar = !this.visibleSidebar;
    this.orderConfirmed = false;
    this.loadCart()
  }

  changeDullScreenMode() {
    if (this.width < 650) {
      this.isFullScreen = true
    } else {
      this.isFullScreen = false
    }
  }

  async loadCart(): Promise<void> {
    this.loading = true;
    this.order = await this.orderService.getOrder(true);
    if (this.order) this.price = this.order.price
    this.loading = false;    
  }

  removeFromCart(event: Event, guid: string): void{
    event.preventDefault();
    this.orderService.removeFromCart(guid);
  }

  confirmOrder(event: Event): void{
    event.preventDefault();
    this.showAuthoriztion.emit(true);
    this.orderConfirmed = true;
    // this.confirm.emit();
  }

  setAmount(product: OrderProduct, method: 'plus' | 'minus') {
    if (method === 'plus') {
      this.cartService.changeAmountProduct(product.guid, ProductAmountAction.increment)
      product.amount++
      this.price = this.price + Number(product.price);
    } else if (method === 'minus' && product.amount > 1) {
      this.cartService.changeAmountProduct(product.guid, ProductAmountAction.decrement)
      product.amount--
      this.price = this.price - Number(product.price);
    }
  }

  orderSubmitted() {
    
  }

  confirmClearCart() {
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Вы уверены, что хотите очистить корзину?' });
  }

  onReject() {
    this.messageService.clear('c');
  }

  onConfirm() {
    this.cartService.clearCart()
    this.loadCart()
    this.visibleSidebar = false
    this.messageService.clear('c');
  }

}
