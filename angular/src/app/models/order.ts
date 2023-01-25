import {DeliveryData, UserData} from "../interface/data";
import {OrderProduct} from "./order-product";
import * as moment from 'moment';
import { CookiesService } from "../services/cookies.service";
import { environment } from "src/environments/environment";

export interface OrderInfo {
  products: OrderProduct[];
  userData?: UserData;
  deliveryData?: DeliveryData;
  phone: string;
  token: string | undefined;
  terminal_id: string;
}

export class Order {

  public products: OrderProduct[];
  public userData?: UserData;
  public deliveryData?: DeliveryData;
  public phone: string;
  public token: string | undefined;
  public terminal_id: string;

  constructor(
    orderInfo: OrderInfo
  ) {
    this.products = orderInfo.products;
    this.userData = orderInfo.userData;
    this.deliveryData = orderInfo.deliveryData;
    this.phone = orderInfo.phone;
    this.token = orderInfo.token;
    this.terminal_id = orderInfo.terminal_id;
  }

  get price(): number {
    return this.products.reduce<number>((previousValue, currentValue) => previousValue + currentValue.finalPrice, 0);
  }

  toJson(): any {
    const date = moment(this.deliveryData?.deliveryDate ?? Date.now());
    return {
      formname: "Cart",
      paymentsystem: this.deliveryData?.paymentMethod?.type,
      phone: this.phone,
      persons: 1,
      name: "31",
      payment: {
        orderid: this.deliveryData?.orderid,
        delivery_price: 100,
        products: this.products.map(product => {
          return product.toJson();
        }),
        delivery_fio: this.userData?.first_name,
        subtotal: this.price,
        delivery_comment: this.deliveryData?.comment,
        delivery: this.deliveryData?.deliveryType?.type,
        delivery_address: this.deliveryData?.deliveryType?.type === "self_delivery" ? '' : `${environment.cities[0]}, ул ${this.userData?.street},  ${this.userData?.house}`,
        amount: this.price + 100,
        terminal_id: this.terminal_id
     },
    }
  }
}
