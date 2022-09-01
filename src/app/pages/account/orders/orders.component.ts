import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AcceptedOrder } from 'src/app/interface/data';
import { WpJsonService } from 'src/app/services/wp-json.service';
import * as moment from 'moment-timezone';
import { orderStatuses } from 'src/app/app.constants';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @Input() handleHttpError!: (error: HttpErrorResponse) => void;
  
  public orders: AcceptedOrder[] = [];
  public ordersShortArray: AcceptedOrder[] = [];
  public lastViewOrder: number = 4;
  public selectedOrder: AcceptedOrder|null = null;
  public selectedOrderId: number|null = null;
  public ordersLoadingStatus: boolean = true;
  readonly moment = moment;
  private timer!: any;

  constructor(
    private wpJson: WpJsonService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getOrders();
    this.route.queryParams.subscribe({
      next: (queryParams:any) => {
        this.setSelectedOrder(queryParams.order);
      }
    });
    // this.requestTimer(1);
  }

  requestTimer(interval: number) {
    this.timer = setInterval(() => {
      if (this.permissionToRequest()) this.getOrders()
    }, interval * 60000);
  }

  permissionToRequest() {
    for (let order of this.ordersShortArray) {
      if (order.status !== 'Delivered' && order.status !== 'Closed' && order.status !== 'Cancelled' ) {
        return true
      }
    }
    return false
  }

  getOrders(): void{
    this.wpJson.getOrders().subscribe({
        next: (result) => {
          this.orders = result;
          this.ordersShortArray = this.orders.slice(0, this.lastViewOrder);
          this.setSelectedOrder(this.selectedOrderId);
        },
        error: this.handleHttpError
      }
    );
    this.ordersLoadingStatus = false;
  }

  setSelectedOrder(orderId?:number|null): void{
    this.selectedOrderId = orderId ?? null;
    this.selectedOrder = this.orders.find((el) => el.id == this.selectedOrderId) ?? null;
  }

  showOrderDetails(event: MouseEvent, orderId: number): void{
    event.preventDefault();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        order: orderId
      },
      queryParamsHandling: 'merge',
    })
  }

  formatStatus(status: string): string|undefined{
    const key = Object.keys(orderStatuses).find((el) => status === el) ?? '';
    if (key === '') {
      return orderStatuses['InProcessing']
    }
    return orderStatuses[key];
  }

  getMoreOrders() {
    this.lastViewOrder += 4;
    this.ordersShortArray = this.orders.slice(0, this.lastViewOrder);
  }
}
