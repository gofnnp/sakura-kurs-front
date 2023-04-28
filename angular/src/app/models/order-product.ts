import { CartModifier, Modifier, Product } from '../interface/data';

export interface OrderProductToJson {
  id: string;
  amount: number;
  price: number;
  quantity: number;
  name: string;
  options?: OrderProductOption[];
}

export interface OrderProductOption {
  option: string;
  variants: {
    variant: string;
    id: string;
    quantity: number | undefined;
  }[];
  id: string;
}

export class OrderProduct implements Product {
  constructor(product: Product, guid: string, amount: number = 1) {
    this.category_id = product.category_id;
    this.currency_symbol = product.currency_symbol;
    this.description = product.description;
    this.id = product.id;
    this.image_gallery = product.image_gallery;
    this.image = product.image;
    // this.modifier_data = product.modifier_data;
    this.name = product.name;
    this.price = product.price;
    this.stock_status = product.stock_status;
    this.amount = amount;
    this.guid = guid;
    this.short_description = product.short_description;
    this.group_id = product.group_id;
    // this.modifiers_group = product.modifiers_group;
  }

  public amount: number;
  public category_id: number;
  public currency_symbol: string;
  public description: string;
  public short_description: string;
  public id: string;
  public image_gallery: string[];
  public image: string;
  // public modifier_data: CartModifier[];
  public name: string;
  public price: number;
  public stock_status: string;
  public guid: string;
  public group_id: string;
  // public modifiers_group: string[];

  get finalPrice(): number {
    // const modifiersPrice = this.modifier_data.reduce<number>(
    //   (previousValue, currentValue) => {
    //     return (
    //       previousValue +
    //       currentValue.options.reduce<number>(
    //         (previousOptionValue, currentOptionValue) => {
    //           return (
    //             previousOptionValue +
    //             Number(
    //               currentOptionValue.price
    //                 ? currentOptionValue.price *
    //                     (currentOptionValue.quantity ?? 0)
    //                 : 0
    //             )
    //           );
    //         },
    //         0
    //       )
    //     );
    //   },
    //   0
    // );
    return Number(this.price) * this.amount;
  }

  toJson(): OrderProductToJson {
    const product: OrderProductToJson = {
      id: this.id,
      amount: this.amount * this.price,
      price: this.price,
      quantity: this.amount,
      name: this.name,
    };
    // const options = this.modifier_data
    //   ?.map((modifier) => {
    //     return {
    //       option: modifier.name,
    //       variants:
    //         modifier.options
    //           .map((option) => ({
    //             variant: option.name,
    //             id: option.id,
    //             quantity: option.quantity,
    //           }))
    //           .filter((option) => option.quantity) || null,
    //       id: modifier.id,
    //     };
    //   })
    //   .filter((modifier) => modifier.variants.length);

    // if (options.length) product.options = options;
    return product;
  }
}
