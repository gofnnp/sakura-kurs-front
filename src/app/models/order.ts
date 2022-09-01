import {DeliveryData, UserData} from "../interface/data";
import {OrderProduct} from "./order-product";
import * as moment from 'moment';
import { CookiesService } from "../services/cookies.service";

export interface OrderInfo {
  products: OrderProduct[];
  userData?: UserData;
  deliveryData?: DeliveryData;
  phone: string;
  token: string | undefined;
}

export class Order {

  public products: OrderProduct[];
  public userData?: UserData;
  public deliveryData?: DeliveryData;
  public phone: string;
  public token: string | undefined;

  constructor(
    orderInfo: OrderInfo
  ) {
    this.products = orderInfo.products;
    this.userData = orderInfo.userData;
    this.deliveryData = orderInfo.deliveryData;
    this.phone = orderInfo.phone;
    this.token = orderInfo.token;
  }

  get price(): number {
    return this.products.reduce<number>((previousValue, currentValue) => previousValue + currentValue.finalPrice, 0);
  }

  toJson(): any {
    const date = moment(this.deliveryData?.deliveryDate ?? Date.now());
    return {
      items: this.products.map(product => {
        return product.toJson();
      }),
      user_data: {
        phone: this.phone,
        ...this.userData
      },
      payment_method: this.deliveryData?.paymentMethod.type,
      delivery_time: date.format('HH:mm'),
      delivery_date: date.format("YYYY-MM-DD"),
      delivery_instance_id: this.deliveryData?.deliveryType?.id,
      persons: 1,
      payments: [
        {
          type: this.deliveryData?.paymentMethod.type,
          summ: this.price,
        },
        {
          type: "crm4retail",
          summ: 0,
          payload: {
            id: "c07a10d8-ba7e-43b0-92aa-ae470060bc7d"
          }
        }
      ],
      comment: this.deliveryData?.comment,
      token: this.token
    }
  }
}
