import {MainPageCode, OrderStatus, Page, PageCode, PaymentMethod} from "./interface/data";

export const PageList: Page[] = [
    // {
    //   code: PageCode.Auth,
    //   name: 'Вход',
    //   resName: 'auth',
    //   onSideBar: false,
    // },
    {
      code: PageCode.Orders,
      name: 'Заказы',
      resName: 'orders',
      onSideBar: true,
    },
];

export const PageListWithBonus: Page[] = [
    // {
    //     code: PageCode.Auth,
    //     name: 'Вход',
    //     resName: 'auth',
    //     onSideBar: false,
    // },
    {
        code: PageCode.BonusProgram,
        name: 'Ваша карта лояльности',
        description: '',
        resName: 'bonus-program',
        onSideBar: true,
    },
    {
        code: PageCode.Orders,
        name: 'Ваши чеки',
        description: '',
        resName: 'orders',
        onSideBar: true,
    },
    // {
    //     code: PageCode.UserData,
    //     name: 'Заполнить анкету',
    //     description: '',
    //     resName: 'user-data',
    //     onSideBar: true
    // },
    // {
    //     code: PageCode.RefSystem,
    //     name: 'Пригласить друга',
    //     description: '',
    //     resName: 'ref-system',
    //     onSideBar: true,
    // },
];

export const PageListMain: Page[] = [
    {
        code: MainPageCode.Account,
        name: 'Аккаунт',
        resName: 'account',
        onSideBar: true,
    },
    {
        code: MainPageCode.Products,
        name: 'Товары',
        resName: 'products',
        onSideBar: true,
    },
    {
        code: MainPageCode.Cart,
        name: 'Корзина',
        resName: 'cart',
        onSideBar: true,
    },
]

export const orderStatuses: OrderStatus = {
    'Cancelled': 'Отменен',
    'InProcessing': 'В обработке',
    'Unconfirmed': 'Принят',
    'WaitCooking': 'Принят',
    'ReadyForCooking': 'Принят',
    'CookingStarted': 'Готовится',
    'CookingCompleted': 'Приготовлен',
    'Waiting': 'В пути',
    'OnWay': 'В пути',
    'Delivered': 'Выполнен',
    'Closed': 'Выполнен',
};

export const paymentMethods: PaymentMethod[] =  [
    {
      type: 'Card',
      label: 'Безналичный расчет'
    },
    {
      type: 'Cash',
      label: 'Наличными'
    }
  ]