import {Modifier, Product} from "../interface/data";
export class OrderProduct implements Product{


  constructor(product: Product,guid: string, amount: number = 1) {
    this.category_id = product.category_id;
    this.currency_symbol = product.currency_symbol;
    this.description = product.description;
    this.id = product.id;
    this.image_gallery = product.image_gallery;
    this.image_url = product.image_url;
    this.modifier_data = product.modifier_data;
    this.name = product.name;
    this.price = product.price;
    this.stock_status = product.stock_status;
    this.amount = amount;
    this.guid = guid;
    this.short_description = product.short_description;
  }


  public amount: number;
  public category_id: number;
  public currency_symbol: string;
  public description?: string;
  public short_description?: string;
  public id: number;
  public image_gallery: string[];
  public image_url: string;
  public modifier_data: Modifier[];
  public name: string;
  public price: string;
  public stock_status: string;
  public guid: string;


  get finalPrice(): number{
    const modifiersPrice = this.modifier_data.reduce<number>((previousValue, currentValue) => {
      return previousValue + currentValue.options.reduce<number>((previousOptionValue, currentOptionValue) => {
        return previousOptionValue + Number(currentOptionValue.price);
      }, 0);
    }, 0);
    return (Number(this.price) + modifiersPrice) * this.amount;
    new Date()
  }

  toJson(){
    return {
      id: this.id,
      amount: this.amount,
      name: this.name,
      modifiers: this.modifier_data?.map(modifier => {
        return {
          id: modifier.id,
          options: modifier.options,
        }
      }),
    }
  }


}
