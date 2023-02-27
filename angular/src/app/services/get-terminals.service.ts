import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ITerminal } from '../interface/data';
import { CartService } from './cart.service';
import { CookiesService } from './cookies.service';
import { WpJsonService } from './wp-json.service';

export interface IGetTerminalList {
  list: ITerminal[];
  active: ITerminal;
}

@Injectable({
  providedIn: 'root'
})
export class GetTerminalsService {
  public terminalList!: ITerminal[];
  public selectedTerminal!: ITerminal;

  constructor(
    private wpJsonService: WpJsonService,
    public cartService: CartService,
    private cookiesService: CookiesService,
    ) { }

  async getTerminalList(): Promise<IGetTerminalList> {
    const terminalList = await lastValueFrom(
      this.wpJsonService.getTerminalList()
    );
    this.terminalList = this.toTreeJson(
      this.keyValue(terminalList),
      terminalList
    );
    const terminalFromCookie = JSON.parse(
      this.cookiesService.getItem('selectedTerminal') || 'null'
    );

    const conditionDelete = this.terminalList.find(
      (terminal: any) =>
        JSON.stringify(terminal) === JSON.stringify(terminalFromCookie)
    );
    if (!conditionDelete) {
      this.cookiesService.deleteCookie('selectedTerminal');
    }

    const selectedTerminal = terminalFromCookie
      ? this.terminalList.find(
          (value: any) => value.id === terminalFromCookie.id
        )
      : null;
    if (!selectedTerminal) {
      this.cartService.clearCart();
    }
    this.selectedTerminal = selectedTerminal || this.terminalList[0];
    this.cartService.changeTerminal(this.selectedTerminal);
    return {
      list: this.terminalList,
      active: this.selectedTerminal
    }
  }

  toTreeJson(array: Array<string>, terminalList: any): Array<ITerminal> {
    let treeJson: ITerminal[] = [];
    for (const key of array) {
      treeJson.push({
        label: key,
        id: terminalList[key],
      });
    }
    return treeJson;
  }
  
  keyValue(obj: Object) {
    return Object.keys(obj);
  }
}
