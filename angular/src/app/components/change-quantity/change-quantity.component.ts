import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface ChangeValue {
  type: 'plus' | 'minus',
  variableQuantity: number
}

@Component({
  selector: 'app-change-quantity',
  templateUrl: './change-quantity.component.html',
  styleUrls: ['./change-quantity.component.scss']
})
export class ChangeQuantityComponent implements OnInit {
  @Output() onChangeValue = new EventEmitter<ChangeValue>();
  @Input() variableQuantity: number = 1
  @Input() value: number = 1
  @Input() disabledButton: 'minus' | 'plus' | 'none' | string[] = 'none'

  constructor() { }

  ngOnInit(): void {
  }

  changeValue(changeValue: ChangeValue) {
    this.onChangeValue.emit(changeValue)
  }

}
