import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { ProductsListComponent } from 'src/app/components/products-list/products-list.component';
import { Product, Purchase } from 'src/app/interface/data';
import { ApiService } from 'src/app/services/api.service';

export interface StatusOrder {
  id: number;
  name: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  public orders = new MatTableDataSource<Purchase>([])
  public displayedColumns: string[] = ['id', 'dateCreated', 'dateChanges', 'products', 'status', 'email'];
  public statuses!: StatusOrder[];

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private api: ApiService,
    private messageService: MessageService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    forkJoin([this.api.getStatuses(), this.api.getAllOrders()]).subscribe({
      next: (value) => {
        this.statuses = value[0].values
        this.orders.data = value[1].values.map((order: any) => {
          return {
            ...order,
            products: JSON.parse(order.products),
            status: this.statuses[order.status_id - 1]
          }
        })
        this.orders.paginator = this.paginator;
      }
    })
  }

  changeOrderStatus(orderId: number, statusId: number) {
    this.api.changeOrderStatus(orderId, statusId).subscribe({
      next: (value) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Статус успешно изменен!'
        })
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Произошла ошибка во время смены статуса'
        })
      }
    })
  }

  ngAfterViewInit() {
  }

  showProducts(products: Product[]) {
    const dialogRef = this.dialog.open(ProductsListComponent, {
      data: {products},
    });
  }

}
