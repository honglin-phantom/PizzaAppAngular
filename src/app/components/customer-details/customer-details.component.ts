/**
 * @description: reusable component that receives only the FormGroup related to the customer details
 *               able to be reused with other forms as long as the component isolated from the paren
 *               t form structure. This ensures that the component is only aware of the Customer Det
 *               ails context and not about its host
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  /**
   * @param: decorator that marks a class field as an input property and is bound to a DOM property in the template
   *         during change detection, Anular will automatically update the data property with the DOM property's va
   *         lue
   */
  @Input() group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
