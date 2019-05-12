import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IToppingItem, PizzaSizeEnum } from './pizza-form.interface';

@Injectable()
export class PizzaFormValidatorsService {

  constructor() {}

  /* 整个表单验证器 */
  /**
   * formValidator(): class method
   * ValidatorFn: return function that receives the control object that will be form definition and return a ValidationError object or null
   */
  formValidator(): ValidatorFn {
    return (control: FormGroup): ValidationErrors | null => {
      /* 定义 errors 对象 */
      const errors: ValidationErrors = {};

      /* FormGroup 中 key 为 pizzas 的 FromArray 若为空 (无效) */
      if (!(control.get('pizzas') as FormArray).length) {
        /* 定义 errors 对象的成员 noPizzas */
        errors.noPizzas = {
          message: 'You must select at least one pizza to order'
        };
      }

      /* ValidatorFn will return ValidationErrors | null object */
      return Object.keys(errors).length ? errors : null; /* if ValidationErrors has a property defined such as noPizzas, return the error */
    };
  }

  /* pizza 表单群验证器, 每一个 pizza {1. size 2. toppings[]} */
  pizzaItemValidator(): ValidatorFn {
    return (control: FormGroup): ValidationErrors | null => {
      const errors: ValidationErrors = {};

      /* 得到当前控制器 (用户输入) key 为 size 的值 */
      const pizzaSize: PizzaSizeEnum = control.get('size').value;
      /* 得到 toppings 被选中的控制器的值 */
      const pizzaToppings: IToppingItem[] = control.get('toppings').value.filter(i => i.selected);

      if (pizzaSize !== PizzaSizeEnum.LARGE && pizzaToppings.length > 4) {
        /* 定义 errors object 的一个 property: toppingPizzaSize */
        errors.toppingPizzaSize = {
          message: 'To use more then 4 toppings you must selected large pizza'
        };
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  /* 验证所有表单域 */
  validateAllFormFields(formGroup: FormGroup) {
    /* 将表单群中的所有控制器以 key 的形式存储到数组中并遍历每一个 key */
    Object.keys(formGroup.controls).forEach(field => {
      /* AbstractControl.get(): retrieves a child control given the control's name or path */
      const control = formGroup.get(field);

      /* FormControl: track the value and status information of an individual form control */
      if (control instanceof FormControl) { /* 若 control 是单独的控制器 */
        /* AbstractControl.markAsTouched(): marks the control as touched
                                            a control is touched by focus and blur event that do not change the value */
        control.markAsTouched({ onlySelf: true }); /* onlySelf: true 只标记当前的控制器为 touched 而不追踪其 ancestors */
      } else if (control instanceof FormGroup) { /* 若 control 是包含更多控制器的表单群 */
        /* nested and recursively check inner form controls */
        this.validateAllFormFields(control);
      }
    });
  }
}
