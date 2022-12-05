import { CartModifier, Modifier, ModifiersGroup, Option } from "../interface/data";
import { v4 as uuidv4 } from 'uuid';

export class CartProduct {


  constructor(id: string, name: string, modifiers: ModifiersGroup[] = [], options: Modifier[], amount: number = 1) {
    this.id = id;
    this.guid = uuidv4();
    this.amount = amount;
    this.name = name;
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
  modifiers: CartModifier[];

  increment(): void {
    this.amount++;
  }

  decrement(): void {
    if (this.amount > 0) {
      this.amount--;
    }
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
