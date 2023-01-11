import { CartModifier, Modifier, ModifiersGroup } from "../interface/data";
import { v4 as uuidv4 } from 'uuid';

export class CartProduct {


  constructor(id: string, name: string, modifiers: ModifiersGroup[] = [], options: Modifier[], price: number, amount: number = 1) {
    this.id = id;
    this.guid = uuidv4();
    this.amount = amount;
    this.name = name;
    this.price = price * amount
    this.modifiers = modifiers.map(modifier => ({
      name: modifier.name,
      id: modifier.id,
      idLocal: uuidv4(),
      options: JSON.parse(JSON.stringify(options)).filter((option: any) => option.groupId === modifier.id),
      restrictions: modifier.restrictions,
      get allQuantity() {
        return this.options.reduce((a: any, b: any) => a + (b['quantity'] || 0), 0)
      }
    }));
    this.modifiers.forEach((modifier) => {
      modifier.options.forEach((option) => {
        option.idLocal = uuidv4()
        if (!option.quantity && option.quantity !== 0) {
          option.quantity = option.restrictions.byDefault
        }
      })
    })
  }

  id: string;
  guid: string;
  amount: number;
  name: string;
  price: number;
  modifiers: CartModifier[];

  increment(): void {
    this.amount++;
  }

  decrement(): void {
    if (this.amount > 0) {
      this.amount--;
    }
  }

  incrementOption(modifierId: string, optionId: string): void {
    const modifier = this.modifiers.find((modifier) => modifier.idLocal === modifierId)
    const option = modifier?.options.find((option) => option.idLocal === optionId)
    if (!option?.quantity && option?.quantity !== 0) return
    option.quantity++
  }

  decrementOption(modifierId: string, optionId: string): void {
    const modifier = this.modifiers.find((modifier) => modifier.idLocal === modifierId)
    const option = modifier?.options.find((option) => option.idLocal === optionId)
    if (!option?.quantity && option?.quantity !== 0) return
    option.quantity--
  }

  get finalPrice(): number{
    const modifiersPrice = this.modifiers.reduce<number>((previousValue, currentValue) => {
      return previousValue + currentValue.options.reduce<number>((previousOptionValue, currentOptionValue) => {
        return previousOptionValue + Number(currentOptionValue.price ? currentOptionValue.price * (currentOptionValue.quantity ?? 0) : 0);
      }, 0);
    }, 0);
    return (Number(this.price) + modifiersPrice) * this.amount;
  }

  // addOption(modifier: ModifiersGroup, option: Modifier): void {
  //   const productModifier = this.modifiers.find(value => value.id === modifier.id);
  //   if (productModifier) {
  //     const optionIndex = productModifier.options.findIndex(value => value.id === option.id);
  //     if (optionIndex === -1) {
  //       productModifier.options.push(option);
  //     }
  //     else {
  //       productModifier.options.splice(optionIndex, 1)
  //     }
  //   }
  // }
}
