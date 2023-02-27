import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Group, Modifier, ModifiersGroup, Product } from '../../interface/data';
import { v4 as uuidv4 } from 'uuid';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductModalComponent } from 'src/app/components/product-modal/product-modal.component';
import { WpJsonService } from 'src/app/services/wp-json.service';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CookiesService } from 'src/app/services/cookies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TerminalListComponent } from 'src/app/components/terminal-list/terminal-list.component';
import { GetTerminalsService } from 'src/app/services/get-terminals.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [MessageService],
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
  public currentPage: number = 0;

  constructor(
    public dialogService: DialogService,
    private wpJsonService: WpJsonService,
    public cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
    private _getTerminals: GetTerminalsService
  ) {}

  async ngOnInit() {
    this.loading = true;
    await this.getTerminalList();
    this.getData();
    // this.messageService.add({
    //   severity: 'info',
    //   summary: 'В одном заказе могут быть товары только из выбранного пункта выдачи',
    //   life: 5000
    // });
    this.loading = false;
  }

  async getTerminalList() {
    const _getTerminals = await this._getTerminals.getTerminalList()
    this.terminalList = _getTerminals.list
    this.selectedTerminal = _getTerminals.active
  }

  getData() {
    this.wpJsonService
      .getAllData(`${this.selectedTerminal.label}${this.selectedTerminal.id}`)
      .subscribe({
        next: (value) => {
          this.products = value.products;
          this.groups = value.groups;
          this.groups.unshift({
            id: uuidv4(),
            label: 'Все',
          });
          this.selectedGroup = this.groups[0];
          this.modifiersGroups = value.modifiers_groups;
          this.modifiers = value.modifiers;

          this.route.queryParams.subscribe((params) => {
            if (params['group']) {
              this.selectedGroup =
                this.groups.find((group) => group.label === params['group']) ||
                this.groups[0];
            }
          });
        },
      });
  }

  onPageChange(event: any) {
    this.currentPage = event.first;
  }

  filterByGroup(group?: Group) {
    if (!this.selectedGroup) return [];
    if (this.selectedGroup.label === 'Все') {
      if (group)
        return JSON.parse(
          JSON.stringify(
            this.products.filter((product) => product.groupId === group.id)
          )
        ).slice(0, 4);
      return this.products;
    }
    return JSON.parse(
      JSON.stringify(
        this.products.filter(
          (product) => product.groupId === this.selectedGroup.id
        )
      )
    );
  }

  cropList(list: Array<any>, quantity: number) {
    return list.slice(this.currentPage, this.currentPage + quantity);
  }

  addToCart(event: MouseEvent, product: Product) {
    if (event) {
      event.preventDefault();
    }
    const productModalWidth = product.modifiers_group.length ? '94vw' : '50vw';
    const productModalMaxWidth = product.modifiers_group.length
      ? '1400px'
      : '500px';
    const ref = this.dialogService.open(ProductModalComponent, {
      header: product.name,
      width: 'fit-content',
      style: {
        'max-width': productModalMaxWidth,
        'min-width': '300px',
        'max-height': '90vh',
        'border-radius': '1.125rem',
        width: productModalWidth,
      },
      contentStyle: {
        'max-height': '90vh',
        height: 'auto',
        overflow: 'auto',
      },
      styleClass: 'product-modal-view',
      data: {
        product: product,
        modifiersGroups: this.modifiersGroups,
        modifiers: this.modifiers,
      },
      baseZIndex: 10000,
      autoZIndex: true,
      dismissableMask: true,
      closeOnEscape: true,
    });
  }

  showTerminals() {
    const bottomSheet = this._bottomSheet.open(TerminalListComponent, {
      data: {
        list: this.terminalList,
        active: this.selectedTerminal,
      },
      ariaLabel: 'Список точек',
    });
    bottomSheet.afterDismissed().subscribe((selectedTerminal) => {
      if (!selectedTerminal) return;
      setTimeout(() => {
        this.products.length = 0;
        this.loading = true;
        this.selectedTerminal = selectedTerminal;
        this.getData();
        this.cartService.changeTerminal(this.selectedTerminal);
        this.loading = false;
        this.router.navigate([]);
        this.currentPage = 0;
      }, 0);
    });
  }

  changeGroup(group: Group) {
    this.selectedGroup = group;
    this.router.navigate([], {
      queryParams: {
        group: group.label,
      },
      queryParamsHandling: 'merge',
    });
    this.currentPage = 0;
  }
}
