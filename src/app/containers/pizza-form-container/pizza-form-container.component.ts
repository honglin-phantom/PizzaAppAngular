import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DEMO_PIZZA } from './services/demo-pizza-item';
import { PizzaFormValidatorsService } from './services/pizza-form-validators.service';
import { IPizzaFormInterface } from './services/pizza-form.interface';
import { PizzaFormService } from './services/pizza-form.service';
import { PizzaLoaderService } from './services/pizza-loader.service';

@Component({
  selector: 'app-pizza-form-container',
  templateUrl: './pizza-form-container.component.html',
  styleUrls: ['./pizza-form-container.component.scss'],
  /**
   * 供应商包括当前元件需要的服务
   *
   * when providing a service in the component a new instance of the service wil
   * l be created when the component bootstraps and destructed when component is
   * destroyed
   *
   * purpose: a single instance of the service will be created as opposed to pro
   *          viding the service in AppModule where a single instance of the ser
   *          vice will be created throughout the entire lifecycle of the app
   */
  providers: [
    PizzaFormService,
    PizzaFormValidatorsService,
    PizzaLoaderService
  ]
})
export class PizzaFormContainerComponent implements OnInit {
  editMode = false;

  /* getter method: 通过当前注入的披萨表单服务返回表单来定义 getter 方法 */
  get form(): FormGroup {
    /* 表单服务中定义的 form 表单群 (通过 key - value pair 的形式构造表单的内容) */
    return this.pizzaFormService.form; /* 当前表单群通过表单构造器将三层表单元素集合并捆绑到一个表单域验证器 */
  }

  /* getter method: 通过当前注入的披萨表单服务定义 getter 方法 */
  get selectedPizzaGroup(): AbstractControl {
    /* 通过表单服务的 getter 方法 pizzasArray() 返回的 pizzas 表单群数组的长度判断当前表单群中的表单控制器数量 */
    if (!this.pizzaFormService.pizzasArray.length) return;

    /* 通过返回得到的表单群数组的下标操作符得到下标为 当前通过 form getter 方法返回的 selectedPizza 位置为下标的值 (i.e 被选披萨的下标为 3, 则以抽象控制类返回表单数组中下标为 3 的 pizza) */
    return this.pizzaFormService.pizzasArray.at(this.form.get('selectedPizza').value);
  }

  constructor(
    private pizzaLoaderService: PizzaLoaderService,
    private pizzaFormService: PizzaFormService
  ) { }

  ngOnInit() {
    /* 当页面地址通过 id 的形式限定, 通过 pizzaLoaderService 服务从服务器端载入 id 对应的 pizza */
    if (this.editMode) {
      /**
       * @param: DEMO_PIZZA - IPizzaFormInterface
       * @returns: 通过 loadPizzaForEdit 服务将 mock up 数据 map 到当前的表单中编辑
       */
      this.pizzaLoaderService.loadPizzaForEdit(DEMO_PIZZA);
    }
  }

  /* 异步递交表单数据 */
  async submit(data: IPizzaFormInterface) {
    /* 若当前表单存在无效表单域则直接返回不递交 */
    if (!this.pizzaFormService.isValid) {
      return;
    }

    /* 通过表单服务的 createPizzaOrderDto(data: IPizzaFormInterface) 创建披萨订单 */
    const order: IPizzaFormInterface = this.pizzaFormService.createPizzaOrderDto(data);

    alert(`Thanks ${order.customerDetails.firstName}, the pizza is on the way!`);

    if (this.editMode) {
      /* 若处于编辑模式则更新 api endpoint call 以更新数据 */
    } else {
      /* 若当前模式不可编辑则创建 api endpoint call 以更新数据 */
    }
  }

  reset() {
    this.pizzaFormService.resetForm();
  }

  onPizzaAdd() {
    this.pizzaFormService.addPizza();
    this.pizzaFormService.selectPizzaForEdit(this.pizzaFormService.pizzasArray.length - 1);
  }

  onPizzaDelete(index: number) {
    this.pizzaFormService.deletePizza(index);
  }

  onPizzaSelected(index: number) {
    this.pizzaFormService.selectPizzaForEdit(index);
  }
}
