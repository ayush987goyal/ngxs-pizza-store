import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { SelectPizza } from '../../store/pizzas/pizzas.actions';

@Component({
  selector: 'app-pizza-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['pizza-item.component.scss'],
  template: `
    <div class="pizza-item">
      <a (click)="selectPizza()">
        <app-pizza-display
          [pizza]="pizza">
        </app-pizza-display>
        <h4>{{ pizza.name }}</h4>
        <button type="button" class="btn btn__ok">
          View Pizza
        </button>
      </a>
    </div>
  `
})
export class PizzaItemComponent {
  @Input() pizza: any;

  constructor(private store: Store, private router: Router) {}

  selectPizza() {
    this.store.dispatch(new SelectPizza(this.pizza.id));
    this.router.navigate(['/products', this.pizza.id]);
  }
}
