/* small component being responsible for size pick among Enum: small, medium, large */
import { Component, forwardRef } from '@angular/core';
/* forwardRef: 提前引用 allows to refer to references which are not yet defined */
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * ControlValueAccessor: a bridge between Angular Forms API and a native element in the DOM, used when create custom form control
 *                       directive that integrates with Angular forms
 * NG_VALUE_ACCESSOR: provide a ControlValueAccessor for form controls
 */
import { PizzaSizeEnum } from '../../containers/pizza-form-container/services/pizza-form.interface';

@Component({
  selector: 'app-pizza-size-picker',
  templateUrl: './pizza-size-picker.component.html',
  styleUrls: ['./pizza-size-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      /* existing token to return */
      useExisting: forwardRef(() => PizzaSizePickerComponent),
      /* <app-pizza-size-picker formControlName="size"></app-pizza-size-picker> will return no value accessor for form control with
         name: 'size', Angular at startup uses this token to register the element with respected model */
      multi: true
    }
  ]
})
export class PizzaSizePickerComponent implements ControlValueAccessor { /* complete hook of form control component */
  pizzaSize: PizzaSizeEnum;
  PizzaSizeEnum = PizzaSizeEnum;

  constructor() { }

  changeSize(size: PizzaSizeEnum) {
    this.pizzaSize = size;
    this.propagateChange(size);
  }

  /* change local component state and call propateChange to notify the parent formGroup of the change */
  propagateChange = (value: PizzaSizeEnum) => {};

  /* write a new value to the controller if this.form.get('size').setValue(1) is called */
  writeValue(value: PizzaSizeEnum) {
    /* write the new value to the local property pizzaSize */
    this.pizzaSize = value;
  }

  /* called when the component is bootstrapped in the form context */
  registerOnChange(fn) {
    /* pass a function that is used later to notify the host form about changes inside our custom component */
    this.propagateChange = fn;
  }

  /* used to pass the touched event to the form */
  registerOnTouched() {}
}
