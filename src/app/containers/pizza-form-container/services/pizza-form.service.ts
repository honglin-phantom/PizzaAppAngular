import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PizzaFormValidatorsService } from './pizza-form-validators.service';
import { IPizzaFormInterface, IToppingItem, PizzaSizeEnum, PizzaToppingsEnum } from './pizza-form.interface';

@Injectable()
export class PizzaFormService {
  public availableToppings = [...Object.values(PizzaToppingsEnum)];
  public form: FormGroup;

  constructor(
    private pizzaValidatorsService: PizzaFormValidatorsService,
    private fb: FormBuilder
  ) {
    /* 同一张表单构造器将表单元素集合及表单验证器组合 */
    this.form = this.fb.group({
      /* 第一层表单元素 */
      selectedPizza: null,
      /* pizzas 域对应子控制器数组: 每一个子控制器通过 下标 与 值 建立映射关系 */
      pizzas: this.fb.array([]),
      /* 用户细节为当前表单构造器下单列的第二层表单元素集合 */
      customerDetails: this.fb.group({
        /* 定义表单域的数据形式 (需要验证) - 通过绑定到表单自带的验证器 */
        /**
         * 单一控制器验证: built-in validator
         * required
         *      min
         *      max
         *  pattern: regex match
         *
         * Validators.compose(param: an array of built-in and custom validators)
         */
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        /* 地址键为当前表单构造器下第三层表单元素集合 */
        address: this.fb.group({
          street: [null, Validators.required],
          houseNum: [null, Validators.required],
          city: [null, Validators.required],
          floor: [null, Validators.required],
        })
      })
    }, {
      /**
       * this.form = this.fb.group({
       *  formGroup definition goes here ...
       * }, {
       *  options: param () - accept a customized form validator
       * });
       */
      validator: this.pizzaValidatorsService.formValidator() /* 通过验证服务得到一个表单验证器 */
    });
  }

  /* getter 方法返回当前表单中键为 'pizzas' 的 */
  get pizzasArray(): FormArray {
    /* 表单数组: tracks the value and validity state of an array of FormControl, FormGroup, or FormArray instances */
    return this.form.get('pizzas') as FormArray;
    /* 表单数组: aggregates the values of each FormControl into an array and calculates its status by reducing status values of its children */
    /* i.e. if one of the controls in FormArray is invalid, the entire array becomes invalid */
  }

  /* getter 方法检测当前表单是否有效 */
  get isValid(): boolean {
    /* AbstractControl: valid - a form control is valid if its status is valid */
    if (!this.form.valid) {
      /* 通过表单验证服务验证当前表单的所有表单域并标记无效表单域 */
      this.pizzaValidatorsService.validateAllFormFields(this.form);
      /* 返回无效 */
      return false;
    }

    return true;
  }

  selectPizzaForEdit(index: number) {
    this.form.get('selectedPizza').setValue(index);
  }

  /**
   * pizzaGroup: 默认参数值为 pizza size 为 medium 的 pizza 表单
   */
  addPizza(): FormGroup {
    const pizzaGroup = this.getPizzaFormGroup();
    /* pizzasArray: array of pizza FormGroup that contains pizza object & validator object */
    this.pizzasArray.push(this.getPizzaFormGroup());

    /* markAsDirty(): marks the control as dirty, a control becomes dirty when the control is changed through UI (user input) */
    this.form.markAsDirty();

    return pizzaGroup;
  }

  deletePizza(index: number): void {
    this.pizzasArray.removeAt(index);
    this.form.markAsDirty();
  }

  /**
   * return: pizza & validator FromGroup
   */
  getPizzaFormGroup(size: PizzaSizeEnum = PizzaSizeEnum.MEDIUM): FormGroup {
    /* 表单构造器将 pizza 对象 {1. size 2. toppings} 和 validator 对象 {1.validator} 组合成一个 FromGroup 并返回 */
    return this.fb.group({
      size: [size],
      toppings: this.mapToCheckboxArrayGroup(this.availableToppings)
    }, {
      validator: this.pizzaValidatorsService.pizzaItemValidator()
    });
  }

  /* 通过披萨表单构造数据传输对象 */
  createPizzaOrderDto(data: IPizzaFormInterface): IPizzaFormInterface {
    /* 定义订单对象: 1. 客户细节 2. 披萨数组 */
    const order = {
      customerDetails: data.customerDetails,
      pizzas: data.pizzas
    };

    /* pizza: IPizzaItem {1. size 2. toppings} */
    for (const pizza of order.pizzas) { /* 遍历订单中存在的所有 pizza 并将客户选择的 toppings 映射到每一个 pizza 对应的 toppings 数组 */
      pizza.toppings = this.getSelectedToppings(pizza.toppings as IToppingItem[])
        .map((i) => {
          /* 返回的 IToppingItem 类型中包括了所有当前订单 pizza 的 toppings */
          return i.name; /* 更新当前订单 pizza 的 toppings 数组 */
        });
    }

    /* 返回订单对象 */
    return order;
  }

  /* 将传入的订单中存在的 pizza 的 toppings 过滤出所有被勾选的 (属性 selected: true) 的数据 */
  getSelectedToppings(toppings: IToppingItem[]): IToppingItem[] {
    return toppings.filter(i => i.selected);
  }

  resetForm() {
    while (this.pizzasArray.length) {
      this.pizzasArray.removeAt(0);
    }

    this.form.reset();
  }

  /**
   * Create a mapping of a string based dataset
   * to a form array suitable for a multi checkbox array selection.
   * this provides a more concise solution
   * as oppose to working with [true, false, false, true]
   */
  private mapToCheckboxArrayGroup(data: string[]): FormArray {
    return this.fb.array(data.map((i) => {
      return this.fb.group({
        name: i,
        selected: false
      });
    }));
  }
}
