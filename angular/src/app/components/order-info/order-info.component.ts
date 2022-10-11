import { Component, Input, OnInit } from '@angular/core';
import { orderStatuses } from 'src/app/app.constants';
import { AcceptedOrder, OrderProduct } from 'src/app/interface/data';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss']
})
export class OrderInfoComponent implements OnInit {
  @Input() order!: AcceptedOrder;
  @Input() loadingStatus: boolean = false;
  percent: number = 0;
  readonly moment = moment;

  constructor() { }

  ngOnInit(): void {
    this.setPercent();
  }

  setPercent() {
    const statusIndex = this.getStatusIndex(this.order.status);
    if (statusIndex !== -1 && statusIndex !== 0) {
      this.percent = (statusIndex - 1) * 20;
    }
  }

  formatStatus(status: string): string|undefined{
    const key = Object.keys(orderStatuses).find((el) => status === el) ?? '';
    return orderStatuses[key];
  }

  getStatusIndex(status: string) {
    return [...new Set(Object.values(orderStatuses))].findIndex((value) => value === this.formatStatus(status));
  }
  
  getItemModifiersName(item: OrderProduct): string[]{
    return Object.keys(item.modifiers);
  }

}
