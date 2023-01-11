import { CartProduct } from "../models/cart-product";


export enum PageCode {
    // Auth,
    BonusProgram,
    Orders,
    RefSystem,
    UserData
}

export enum MainPageCode {
    Account,
    Products,
    Cart,
    Info
}

export interface Page {
    code: PageCode | MainPageCode;
    component?: any;
    name: string;
    description?: string;
    getMethod?: string;
    resName?: string;
    onSideBar: boolean
    icon?: string;
}

export interface UserDataForm {
    first_name: string;
    birthdate: string;
    gender: string;
}

export interface BonusProgramAccount {
    // BonusProgramName: string;
    // BonusProgramTypeID: string;
    CardNumber: number;
    Bonuses: number;
    // HoldedBonuses: number;
    // BonusProgramAccounts: BonusProgramAccount[];
    // DateBonusBurn: string;
    // _links: any[];
    // _embedded: any;
}

export interface Purchase {
    // PurchaseId?: string;
    // CustomerId?: string;
    // PurchaseDate: string;
    // PurchaseState?: number;
    // CardNumber?: number;
    // Address?: string
    // CheckSummary?: number
    // BonusSummary?: number
    // ID: string;
    // Transactions: Transaction[];
    // IsSingleTransaction?: boolean;
    transactionCreateDate: string;
    orderSum: number;
    transactionSum: number;
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
    ID: string;
    HasPurchase?: boolean;
}

export interface OrderStatus {
    [key: string]: string;
}

export interface DeliveryType {
    cost: number;
    title: string;
    id: number;
    type: string;
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

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    image_gallery: string[];
    category_id: number;
    description: string;
    stock_status: string;
    currency_symbol: string;
    modifier_data: CartModifier[];
    short_description: string;
    guid: string;
    groupId: string;
    modifiers_group: string[];
}

export interface AllData {
    datetime: string;
    groups: Group[];
    products: Product[];
    modifiers_groups: ModifiersGroup[];
    modifiers: Modifier[];
    categories: any[]
}

export interface Group {
    id: string;
    label: string;
}

export interface ModifiersGroup {
    name: string,
    id: string,
    restrictions: {
        minQuantity: number,
        maxQuantity: number,
        freeQuantity: number,
        byDefault: number
    }
}

export interface Modifier {
    id: string,
    idLocal: string,
    name: string,
    groupId: string,
    price?: number,
    quantity?: number,
    image?: string; 
    restrictions: {
        minQuantity: number,
        maxQuantity: number,
        freeQuantity: number,
        byDefault: number
    }
}

export interface CartModifier {
    lastChangeOption?: string;
    id: string;
    idLocal: string;
    name: string;
    options: Modifier[];
    allQuantity: number;
    restrictions: {
        minQuantity: number,
        maxQuantity: number,
        freeQuantity: number,
        byDefault: number
    }
}

export interface Cart {
    products: CartProduct[];
}

// export interface Modifier {
//     id: number;
//     name: string;
//     category_type: string;
//     minimum_options: number;
//     maximum_options: number;
//     global_categories: string;
//     required: number;
//     options: Option[];
//     allOptions?: Option[];
// }

export interface Option {
    id: number;
    name: string;
    groupId: string;
    restrictions: {
        minQuantity: number,
        maxQuantity: number,
        freeQuantity: number,
        byDefault: number
    }
}

export interface OrderProduct {
    id: number;
    amount: number;
    name: string;
    price: number;
    modifiers: {
        [name: string]: OrderModifier[]
    }
}

export interface OrderModifier {
    name: string;
    id: number;
    price: number;
}

export interface DeliveryData {
    paymentMethod: PaymentMethod | null;
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