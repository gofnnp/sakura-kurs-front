

export enum PageCode {
    Auth,
    Orders,
    BonusProgram,
    RefSystem
}
  
export interface Page {
    code: PageCode;
    component?: any;
    name: string;
    description?: string;
    getMethod?: string;
    resName?: string;
    onSideBar: boolean
}

export interface BonusProgramAccount {
    BonusProgramName: string;
    BonusProgramTypeID: string;
    CardNumber: number;
    Bonuses: number;
    HoldedBonuses: number;
    BonusProgramAccounts:  BonusProgramAccount[];
    DateBonusBurn: string;
    _links: any[];
    _embedded: any;
}

export interface Purchase {
    PurchaseId?: string;
    CustomerId?: string;
    PurchaseDate: string;
    PurchaseState?: number;
    CardNumber?: number;
    Address?: string
    CheckSummary?: number
    BonusSummary?: number
    ID: string;
    Transactions: Transaction[];
    IsSingleTransaction?: boolean;
}

export interface Transaction {
    User: string;
    Purchase: string;
    Date: string;
    Value: number;
    TransactionType: number;
    UserBonusesSnapshot: number;
    BonusPercent: number;
    DateActiveBonus: string;
    AccountBonus: string;
    Bonus: string;
    ID:string;
    HasPurchase?:boolean;
}

export interface OrderStatus{
    [key: string]: string;
}

export interface DeliveryType {
    cost: number;
    title: string;
    id: number;
}

export interface AcceptedOrder {
    id: number;
    status: string;
    currency_symbol: string;
    total: number;
    address: {
      city: string;
      street: string;
      house: number;
      flat: number;
    };
    payment_method: string;
    shipping: {
      name: string;
      total: number;
    };
    date_created: string;
    items: OrderProduct[]
}

export interface Product{
    id: number;
    name: string;
    price: string;
    image_url: string;
    image_gallery: string[];
    category_id: number;
    description?: string;
    stock_status: string;
    currency_symbol: string;
    modifier_data: Modifier[];
    short_description?: string;
    guid?: string;
}

export interface Modifier{
    id: number;
    name: string;
    category_type: string;
    minimum_options: number;
    maximum_options: number;
    global_categories: string;
    required: number;
    options: Option[];
    allOptions?: Option[];
}

export interface Option{
    id: number;
    name: string;
    price: string;
    prechecked: string;
    active?: boolean;
}

export interface OrderProduct{
    id: number;
    amount: number;
    name: string;
    price: number;
    modifiers: {
      [name: string]: OrderModifier[]
    }
}

export interface OrderModifier{
    name: string;
    id: number;
    price: number;
}

export interface DeliveryData {
    paymentMethod: PaymentMethod;
    deliveryDate: Date | null;
    deliveryType: DeliveryType | null;
    persons: number;
    comment: string;
}

export interface PaymentMethod {
    type: string;
    label: string;
}

export interface UserData {
    first_name: string | null;
    last_name: string | null;
    street: string | null;
    house: string | null;
    flat: string | null;
    city: string;
    phone: string | null;
}