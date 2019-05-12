/* 定义 Pizza 表单接口: 1. 已选披萨 (单个) 2. 所有的披萨 3. 客户信息 */
export interface IPizzaFormInterface {
  /* ?: optional operator 标记 selectedPizza 为 optional 变量其类型为 IPizzaItem */
  selectedPizza?: IPizzaItem;
  pizzas: IPizzaItem[]; /* array of pizza object contains size and array of pizza toppings */
  customerDetails: ICustomerDetails;
}

/* 定义披萨 Topping 接口: 1. Topping 的名字 (枚举类型) 2. 布尔类型 */
export interface IToppingItem {
  name: PizzaToppingsEnum;
  selected: boolean;
}

/* 定义披萨实物接口: 1. 尺寸 (披萨尺寸枚举类型) 2. 基于服务器端返回的披萨 Topping 枚举类型 */
export interface IPizzaItem {
  size: PizzaSizeEnum;
  /**
   * A small hack for imitating a different model returned from server,
   * for the simplicity sake the same interface was used.
   * In real life the server model may vary from the form model.
   * In this case you need to maintain both the server model interface and the client form interface.
   */
  toppings: IToppingItem[] | PizzaToppingsEnum[];
}

/* 定义客户细节接口 */
export interface ICustomerDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: {
    street: string;
    houseNum: string;
    city: string;
    floor: number;
  };
}

/* 定义披萨尺寸枚举类型 (数值) */
export enum PizzaSizeEnum {
  SMALL = 1,
  MEDIUM = 2,
  LARGE = 3
}

/* 定义披萨点缀品枚举类型 (字符串) */
export enum PizzaToppingsEnum {
  SAUSAGE = 'Sausage',
  PEPPERONI = 'Pepperoni',
  HAM = 'Ham',
  OLIVES = 'Olives',
  BACON = 'Bacon',
  CORN = 'Corn',
  PINEAPPLE = 'Pineapple',
  MUSHROOMS = 'Mushrooms'
}
