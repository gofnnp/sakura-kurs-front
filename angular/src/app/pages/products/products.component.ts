import { Component, OnInit } from '@angular/core';
import { Group, Modifier, ModifiersGroup, Product } from "../../interface/data";
import { v4 as uuidv4 } from 'uuid';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductModalComponent } from 'src/app/components/product-modal/product-modal.component';
import { WpJsonService } from 'src/app/services/wp-json.service';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CookiesService } from 'src/app/services/cookies.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [MessageService]
})
export class ProductsComponent implements OnInit {
  public products!: Product[];
  public groups: Group[] = [];
  public modifiersGroups!: ModifiersGroup[];
  public modifiers!: Modifier[];
  public selectedGroup!: Group;
  public terminalList!: any;
  public selectedTerminal!: any;
  public loading: boolean = false;

  constructor(
    public dialogService: DialogService,
    private wpJsonService: WpJsonService,
    private messageService: MessageService,
    public cartService: CartService,
    private cookiesService: CookiesService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    await this.getTerminalList()
    this.getData()
    this.messageService.add({
      severity:'info',
      summary: 'В одном заказе могут быть товары только из выбранного пункта выдачи',
      life: 5000
    });
    setTimeout(() => {
      this.confirmTerminalList()
    }, 0)
    this.loading = false;
  }

  async getTerminalList() {
    const terminalList = (await lastValueFrom(
      this.wpJsonService.getTerminalList()
    ))
    this.terminalList = this.toTreeJson(this.keyValue(terminalList), terminalList)
    this.selectedTerminal = JSON.parse(this.cookiesService.getItem('selectedTerminal') || 'null') || this.terminalList[0]
    this.cartService.changeTerminal(this.selectedTerminal)
  }

  confirmTerminalList() {
    if (this.cartService.cartCount) return
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Вам подходит пункт выдачи?', detail: this.selectedTerminal.label });
  }

  onConfirm() {
    this.messageService.add({
      severity:'info',
      summary: 'В одном заказе могут быть товары только из выбранного пункта выдачи',
      life: 5000
    });
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
    this.messageService.add({
      severity:'info',
      summary: 'Выберите пункт выдачи. В одном заказе могут быть товары только из выбранного пункта.',
      life: 6000
    });
  }

  getData() {
    this.wpJsonService.getAllData(`${this.selectedTerminal.label}${this.selectedTerminal.id}`).subscribe({
      next: (value) => {
        this.products = value.products
        this.groups = value.groups
        this.groups.unshift(
          {
            id: uuidv4(),
            label: 'Все'
          }
        )
        this.selectedGroup = this.groups[0]
        this.modifiersGroups = value.modifiers_groups
        this.modifiers = value.modifiers
      }
    })
  }

  filterByGroup() {    
    if (!this.selectedGroup) return []
    if (this.selectedGroup.label === 'Все') return this.products
    return this.products.filter((product) => product.groupId === this.selectedGroup.id)
  }

  addToCart(event: MouseEvent, product: Product) {
    if (event) {
      event.preventDefault()
    }
    const ref = this.dialogService.open(ProductModalComponent, {
      header: product.name,
      width: 'auto',
      style: {
        'max-width': '90vw',
        'max-height': '90vh',
      },
      contentStyle: {
        'max-height': '90vh',
        height: 'auto',
        'max-width': '90vw',
        overflow: 'auto',
      },
      data: {
        product: product,
        modifiersGroups: this.modifiersGroups,
        modifiers: this.modifiers
      },
      baseZIndex: 10000,
      autoZIndex: true,
      dismissableMask: true,
      closeOnEscape: true,
    });

  }

  changeTerminal() {
    setTimeout(() => {
      this.products.length = 0;
      this.loading = true;
      this.getData()
      this.cartService.changeTerminal(this.selectedTerminal);
      this.loading = false;
    }, 0);
  }

  onGroupUnselect(event: any) {    
    setTimeout(() => {
      this.selectedGroup = event.node      
    }, 0);
  }

  onTerminalUnselect(event: any) {    
    setTimeout(() => {
      this.selectedTerminal = event.node
      this.cartService.changeTerminal(this.selectedTerminal)
    }, 0);
  }

  keyValue(obj: Object) {
    return Object.keys(obj)
  }

  toTreeJson(array: Array<string>, terminalList: any) {
    let treeJson: Object[] = []
    for (const key of array) {
      treeJson.push(
        {
          label: key,
          id: terminalList[key]
        }
      )
    }
    return treeJson
  }

}
