import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { WpJsonService } from './wp-json.service';
import { forkJoin, lastValueFrom, Observable, of, tap } from 'rxjs';
import {
  Cart,
  DeliveryData,
  DeliveryType,
  Modifier,
  Product,
  UserData,
} from '../interface/data';
import { Order } from '../models/order';
import { OrderProduct } from '../models/order-product';
import { JsonrpcService, RpcService } from './jsonrpc.service';
import { CookiesService } from './cookies.service';
import { MessageService } from 'primeng/api';
import { catchError, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

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
    private api: ApiService
  ) {}

  async getDeliveryTypes(): Promise<DeliveryType[]> {
    return await lastValueFrom(this.wpJsonService.getDeliveryTypes());
  }

  async getOrder(refresh = false): Promise<Order> {
    if (!this.order || refresh) {
      const cart = this.cartService.getCart();

      if (cart.products.length) {
        const token = this.cookiesService.getItem('token') || '';
        const products = await this.getProducts(cart);
        // const additionalInfo = this.jsonRpcService.rpc(
        //   {
        //     method: 'getAdditionalInfo',
        //     params: [],
        //   },
        //   RpcService.authService,
        //   true
        // );
        // const terminal =
        //   JSON.parse(
        //     this.cookiesService.getItem('selectedTerminal') || 'null'
        //   ) || this.cartService.selectedTerminal$;
        // if (!token.length) {
        //   this.order = new Order({
        //     products: products,
        //     userData: null,
        //     phone: '',
        //     token: token,
        //     terminal_id: terminal.id,
        //   });
        //   return this.order;
        // }
        const additionalInfo = this.api.getUser()

        // const tokenData = this.jsonRpcService.rpc(
        //   {
        //     method: 'getTokenData',
        //     params: [this.cookiesService.getItem('token')],
        //   },
        //   RpcService.authService,
        //   true
        // );

        const info = await lastValueFrom(
          forkJoin([additionalInfo]).pipe(
            map((value: any) => {
              return value[0]
            }),
            catchError(err => of({
              errorCode: 401
            }))
          )
        ) as UserData;
        
        const customer_info = info;

        this.order = new Order({
          products: products,
          userData: customer_info,
          // phone: info[1].data?.mobile_number,
          token: token,
          // terminal_id: terminal.id,
        });
      } else if (this.order) {
        this.order.products.length = 0;
      }
    }
    return this.order;
  }

  async getProducts(cart: Cart): Promise<OrderProduct[]> {
    // const terminal =
    //   JSON.parse(this.cookiesService.getItem('selectedTerminal') || 'null');
    const products: OrderProduct[] = [];
    // if (!terminal) {
    //   return products
    // }
    // const allData = await lastValueFrom(
    //   this.wpJsonService.getAllData(`${terminal.label}${terminal.id}`)
    // );
    const allProducts = await lastValueFrom(this.api.getProducts());
    for (let i = 0; i < cart.products.length; i++) {
      const productSub = allProducts.values.find(
        (product: any) => product.id === cart.products[i].id
      );
      if (!productSub) {
        this.cartService.removeFromCart(cart.products[i].guid);
        break;
      }
      const product = Object.assign(cloneDeep(cart.products[i]), {
        category_id: 0,
        price: productSub.price,
        currency_symbol: '₽',
        description: '',
        short_description: '',
        image_gallery: [],
        image: productSub.image,
        // modifier_data: cart.products[i].modifiers,
        stock_status: 'instock',
        group_id: productSub.group_id,
        // modifiers_group: productSub.modifiers_group,
      });
      
      const orderProduct: OrderProduct = new OrderProduct(
        product,
        cart.products[i].guid,
        cart.products[i].amount
      );
      products.push(orderProduct);
    }
    return products;
  }

  removeFromCart(productGuid: string): void {
    this.order.products = this.order.products.filter(
      (value) => value.guid !== productGuid
    );
    this.cartService.removeFromCart(productGuid);
  }

  setUserData(userData: UserData): void {
    this.order.userData = userData;
  }

  setDeliveryData(deliveryData: DeliveryData): void {
    this.order.deliveryData = deliveryData;
  }

  submit(): Observable<any> {
    return this.wpJsonService
      .createOrder(this.order.toJson(), environment.webhookItRetail)
      .pipe(
        tap({
          next: (_) => {
            this.jsonRpcService
              .rpc(
                {
                  method: 'updateAdditionalInfo',
                  params: [this.order.userData, this.order.deliveryData],
                },
                RpcService.authService,
                true
              )
              .subscribe();
          },
        })
      );
  }
}
