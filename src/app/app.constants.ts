import {OrderStatus, Page, PageCode} from "./interface/data";

export const PageList: Page[] = [
    {
      code: PageCode.Auth,
      name: 'Вход',
      resName: 'auth',
      onSideBar: false,
    },
    {
      code: PageCode.Orders,
      name: 'Заказы',
      resName: 'orders',
      onSideBar: true,
    },
];

export const PageListWithBonus: Page[] = [
    {
        code: PageCode.Auth,
        name: 'Вход',
        resName: 'auth',
        onSideBar: false,
    },
    {
        code: PageCode.BonusProgram,
        name: 'Ваша карта лояльности',
        description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне.',
        resName: 'bonus-program',
        onSideBar: true,
    },
    {
        code: PageCode.Orders,
        name: 'Ваши чеки',
        description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне.',
        resName: 'orders',
        onSideBar: true,
    },
    {
        code: PageCode.RefSystem,
        name: 'Пригласить друга',
        description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне.',
        resName: 'ref-system',
        onSideBar: true,
    },
];

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