import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Modifier, Option} from 'src/app/interface/data';
import { cloneDeep } from 'lodash/fp';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupComponent implements OnInit {

  constructor() { }

  @Input() modifier!: Modifier;
  @Input() currencySymbol!: string;

  @Output() toggle = new EventEmitter<Option>();

  @Input() selectedOptions: Option[] = [];
  public options: Option[] = [];

  ngOnInit() {
    // this.options = cloneDeep<Option[]>(this.modifier.options);
  }

  optionIsSelected(option: Option): boolean{
    return !!this.selectedOptions.find(selected => selected.id === option.id);
  }

  onToggle(option: Option){
    this.toggle.emit(option);
  }


}
