import { IPizzaFormInterface, PizzaSizeEnum, PizzaToppingsEnum } from './pizza-form.interface';

/* 导出 IPizzaFormInterface 类型的 DEMO_PIZZA 对象 (跳过 optional 的 selectedPizza) */
export const DEMO_PIZZA: IPizzaFormInterface = {
  /* 通过 key 映射到对应的 value 改变数据 */
  customerDetails: {
    address: {
      floor: 1,
      street: 'Test street',
      houseNum: '44',
      city: 'New York'
    },
    lastName: 'Lover',
    firstName: 'Pizza',
    phoneNumber: '100100100',
  },
  pizzas: [{
    /* mapped to toppings and size keys in IPizzaItem interface */
    toppings: [PizzaToppingsEnum.BACON, PizzaToppingsEnum.MUSHROOMS, PizzaToppingsEnum.OLIVES] as any,
    size: PizzaSizeEnum.MEDIUM
  }]
};
