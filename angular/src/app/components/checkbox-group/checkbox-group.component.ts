import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Modifier, ModifiersGroup, Option} from 'src/app/interface/data';
import { cloneDeep } from 'lodash/fp';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupComponent implements OnInit {

  constructor() { }

  @Input() modifier!: ModifiersGroup;
  @Input() options!: Modifier[];
  @Input() currencySymbol!: string;

  @Output() toggle = new EventEmitter<Modifier>();

  @Input() selectedOptions: Modifier[] = [];

  ngOnInit() {
  }

  optionIsSelected(option: Modifier): boolean{    
    return !!this.selectedOptions.find(selected => selected.id === option.id);
  }

  onToggle(option: Modifier){
    this.toggle.emit(option);
  }


}
