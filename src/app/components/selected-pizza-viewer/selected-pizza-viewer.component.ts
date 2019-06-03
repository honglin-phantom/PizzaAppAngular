import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-selected-pizza-viewer',
  templateUrl: './selected-pizza-viewer.component.html',
  styleUrls: ['./selected-pizza-viewer.component.scss']
})
export class SelectedPizzaViewerComponent implements OnInit {
  /**
   * @Input: 属性装饰器, 用来定义组件内的输入属性, 主要用来实现父组件向子组件传递数据
   *         应用启动时, Angular 会从根组件启动并解析整棵组建树, 数据从上而下流向下
   *         一级子组件
   *
   * @output: 属性装饰器, 用来定义组件内的输出属性, 实现子组件将信息通过事件的形式通
   *          知到父级组件
   *
   * @output('bindingPropertyName'): 指定组件绑定属性的名称
   *
   * EventEmitter: 触发自定义事件
   *               let numberEmitter: EventEmitter<number> = new EventEmitter<number>();
   *               numberEmitter.subscribe((value: number) => console.log(value));
   *               numberEmitter.emit(10);
   *
   *               子指令创建一个 EventEmitter 实例, 并将其作为输出属性导出. 子指
   *               令调用已创建的 EventEmitter 实例中的 emit(payload) 方法来触发
   *               一个事件, 父指令通过事件绑定 (eventName) 的方式监听该事件并通过
   *               $event 对象来获取 payload 对象
   *
   * two-way data binding: 双向绑定是由两个单向绑定组成
   *                       模型 -> 视图 数据绑定 []
   *                       视图 -> 模型 事件绑定 ()
   *                       双向 -> [()]
   *
   *                       [(modelName)] 可以拆分成两部分 modelName 和 modelNameChange,
   *                       [modelName] 用于绑定输入属性, (modelNameChange) 用于绑定输出属
   *                       性
   */
  @Input() selectedPizzaGroup: AbstractControl; /* 父组件通过当前组件的 selector 向当前组件的输入属性 selectedPizzaGroup 传递数据 */
  @Output() addPizza = new EventEmitter();      /* */

  get toppingsArray(): FormArray {
    if (!this.selectedPizzaGroup) return;

    return this.selectedPizzaGroup.get('toppings') as FormArray;
  }

  constructor() { }

  ngOnInit() {

  }

}
