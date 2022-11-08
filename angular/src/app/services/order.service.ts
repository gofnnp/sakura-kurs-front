import {Injectable} from '@angular/core';
import {CartService} from "./cart.service";
import {WpJsonService} from "./wp-json.service";
import {forkJoin, lastValueFrom, Observable, tap} from "rxjs";
import {Cart, DeliveryData, DeliveryType, Modifier, Product, UserData} from "../interface/data";
import {Order} from "../models/order";
import {OrderProduct} from "../models/order-product";
import {JsonrpcService, RpcService} from "./jsonrpc.service";
import {CookiesService} from "./cookies.service";
import {MessageService} from "primeng/api";
import {map} from "rxjs/operators";
import { cloneDeep } from 'lodash';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private order!: Order;

  constructor(
    private cartService: CartService,
    private wpJsonService: WpJsonService,
    private jsonRpcService: JsonrpcService,
    private cookiesService: CookiesService,
    private messageService: MessageService,
  ) {
  }

  async getDeliveryTypes(): Promise<DeliveryType[]> {
    return await lastValueFrom(this.wpJsonService.getDeliveryTypes());
  }


  async getOrder(refresh = false): Promise<Order> {
    if (!this.order || refresh) {
      const cart = this.cartService.getCart();
      
      if (cart.products.length) {
        const products = await this.getProducts(cart);
        const additionalInfo = this.jsonRpcService.rpc({
          method: 'getAdditionalInfo',
          params: []
        }, RpcService.authService, true);
  
        const tokenData = this.jsonRpcService.rpc({
          method: 'getTokenData',
          params: [this.cookiesService.getItem('token')],
        }, RpcService.authService, true);
  
        const info = await lastValueFrom(forkJoin([additionalInfo, tokenData, products]));
        const token = this.cookiesService.getItem('token')
        this.order = new Order({products: products, userData: info[0]?.data, phone: info[1].data?.mobile_number, token: token});
      } else if (this.order) {
        this.order.products.length = 0
      }
    }
    return this.order;
    
  }

  async getProducts(cart: Cart): Promise<OrderProduct[]> {
    const terminal = JSON.parse(this.cookiesService.getItem('selectedTerminal') || 'null') || this.cartService.selectedTerminal$
    const allData = await lastValueFrom(this.wpJsonService.getAllData(`${terminal.label}${terminal.id}`))
    const products: OrderProduct[] = []
    for (let i = 0; i < cart.products.length; i++) {
      const productSub = allData.products.find((product: any) => product.id === cart.products[i].id)
      const product = Object.assign(cloneDeep(cart.products[i]), {
        category_id: 0,
        price: productSub.price,
        currency_symbol: '₽',
        description: '',
        short_description: '',
        image_gallery: [],
        image: productSub.image,
        modifier_data: cart.products[i].modifiers,
        stock_status: 'instock',
        groupId: productSub.groupId,
        modifiers_group: productSub.modifiers_group
      })
      const orderProduct: OrderProduct = new OrderProduct(product, cart.products[i].guid, cart.products[i].amount)
      products.push(orderProduct)
    }
    return products
  }

  removeFromCart(productGuid: string): void {
    this.order.products = this.order.products.filter(value => value.guid !== productGuid);
    this.cartService.removeFromCart(productGuid);
  }

  setUserData(userData: UserData): void {
    this.order.userData = userData;
  }

  setDeliveryData(deliveryData: DeliveryData): void {
    this.order.deliveryData = deliveryData;
  }

  submit(): Observable<any> {
    return this.wpJsonService.createOrder(this.order.toJson(), environment.webhookItRetail).pipe(
      tap({
        next: (_) => {
          this.jsonRpcService.rpc({
            method: 'updateAdditionalInfo',
            params: [this.order.userData, this.order.deliveryData]
          }, RpcService.authService, true).subscribe();
          this.messageService.add({
            severity:'success',
            summary: 'Заказ создан',
          });
        },
      }),
    );
  }
}
