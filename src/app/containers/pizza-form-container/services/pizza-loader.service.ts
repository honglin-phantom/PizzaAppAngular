import { Injectable } from '@angular/core';
import { IPizzaFormInterface, IToppingItem, PizzaToppingsEnum } from './pizza-form.interface';
import { PizzaFormService } from './pizza-form.service';

@Injectable()
export class PizzaLoaderService {

  /* 注入 PizzaFormService 以获得 form 对象的访问权限 */
  constructor(private pizzaFormService: PizzaFormService) {}

  /* 通常 loadPizzaForEdit 函数从 server 端获得一个 order 对象并把其包含的信息传递给需要载入 server 端数据的本地对象 */
  loadPizzaForEdit(data: IPizzaFormInterface): void {
    /* 通过 PizzaFormService 服务的成员 form 将表单的一个控制器 customerDetails (表单群) 作为返回值派送 */
    this.pizzaFormService.form.patchValue({
      /* 派送当前表单的 customerDetails 表单群, 其值通过 ... 操作符将传入的 DEMO_PIZZA 赋值 */
      customerDetails: {
        /* data: IPizzaFormInterface 映射到其成员之一 customerDetails property 并且其值赋值到当前被派送的 customerDetails property 中 */
        ...data.customerDetails
      }
    });

    /* pizza: IPizzaFormInterface 中的 pizzas: IPizzaItem[], 每一个 IPizzaItem 接口 contains {1. size 2. toppings} */
    for (const pizza of data.pizzas) { /* 对每一个从 server 载入的 pizza 对象添加一个 pizza group */
      /**
       * group: pizza FormGroup that contains pizza object & validator object
       */
      const group = this.pizzaFormService.addPizza();

      /* 将参数作为返回值派送回 caller (即 PizzaFormComponent 的 ngOnInit()) */
      group.patchValue({ /* 只有当且仅当 form group 被成功添加到 pizza 对象才可以将其值和从 server 载入的 data patch  */
        /* DEMO_PIZZA 的 size */
        size: pizza.size,
        /**
         * @param: IToppingItem[] - 当前 FormGroup 的 toppings 属性的值
         * @param: DEMO_PIZZA 的 toppings 属性
         * @returns: IToppingItem 接口数组
         */
        toppings: this.prefillToppingsSelection(group.get('toppings').value, pizza.toppings as PizzaToppingsEnum[])
      });
    }
  }

  /**
   * @param toppings: IToppingItem[] - 接口数组每个元素存储 {1. name: PizzaToppingsEnum 类型 2. selected: bool}
   * @param selectedToppings: DEMO_PIZZA's toppings 属性 (存储于 PizzaToppingsEnum 类型的数组中)
   * @return IToopingItem[]: {1. name: PizzaToppingsEnum 2. selected: boolean}
   */
  prefillToppingsSelection(toppings: IToppingItem[], selectedToppings: PizzaToppingsEnum[]): IToppingItem[] {
    /* 遍历 addPizza() 函数创建的 toppings formGroup 中的每一个 form value, 如果已经在 selectedToppings 数组中存在则标记 selected 为 true */
    return toppings.map((i) => {
      /* 如果当前 IToppingItem 接口的 name: PizzaToppingEnum 属性在 DEMO_PIZZA 中存在则标记该接口的 selected 属性为 true */
      if (selectedToppings.includes(i.name)) {
        i.selected = true;
      }

      /* 放回 mapped 的接口 */
      return i;
    });
  }
}
