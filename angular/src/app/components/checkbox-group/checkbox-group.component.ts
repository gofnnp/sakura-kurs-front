import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CartModifier, Modifier, ModifiersGroup, Option} from 'src/app/interface/data';
import { cloneDeep } from 'lodash/fp';
import { ChangeValue } from '../change-quantity/change-quantity.component';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupComponent implements OnInit {

  constructor() { }

  @Input() modifier!: CartModifier;
  @Input() options!: Modifier[];
  @Input() currencySymbol!: string;
  @Input() selectedOptions: Modifier[] = [];

  @Output() toggle = new EventEmitter<Modifier>();
  @Output() onChangeQuantity = new EventEmitter<any>();
  

  public allQuantity!: number

  ngOnInit() {
    this.allQuantity = this.getAllQuantity(this.options, 'quantity')
  }

  getAllQuantity(array: Array<any>, key: string) {
    return array.reduce((a, b) => a + (b[key] || 0), 0);
  }

  optionIsSelected(option: Modifier): boolean{    
    return !!this.selectedOptions.find(selected => selected.id === option.id);
  }

  onToggle(option: Modifier){
    this.toggle.emit(option);
  }

  changeQuantity(value: ChangeValue, option: Modifier) {
    this.onChangeQuantity.emit({
      value,
      option,
      modifierGroup: this.modifier
    })
    this.allQuantity = this.getAllQuantity(this.options, 'quantity')
    
  }

  getDisabledButton(option: Modifier) {
    if (!option.quantity && option.quantity !== 0) option.quantity = option.restrictions.byDefault
    const minusCondition = option.quantity === 0 || option.quantity === option.restrictions.minQuantity
    const plusCondition = option.quantity === option.restrictions.maxQuantity && option.restrictions.maxQuantity !== 0
    const maxQuantityCondition = this.allQuantity === this.modifier.restrictions.maxQuantity && this.modifier.restrictions.maxQuantity !== 0
    const minQuantityCondition = this.allQuantity === this.modifier.restrictions.minQuantity
    let result: any = 'none'
    if (minusCondition || (minQuantityCondition && !minusCondition)) result = 'minus'
    if (plusCondition || (maxQuantityCondition && !minusCondition)) result = 'plus'
    if ((maxQuantityCondition && minusCondition) || (minQuantityCondition && plusCondition)) result = ['plus', 'minus']
    return result
  }

}
