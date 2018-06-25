import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Pizza } from '../../models/pizza.model';
import { PizzasState } from '../../store/pizzas/pizzas.state';
import { CreatePizza, UpdatePizza, DeletePizza } from '../../store/pizzas/pizzas.actions';

import { Topping } from '../../models/topping.model';
import { ToppingsState } from '../../store/toppings/toppings.state';
import { VisualizeToppings } from '../../store/toppings/toppings.actions';

@Component({
  selector: 'app-product-item',
  styleUrls: ['product-item.component.scss'],
  template: `
    <div
      class="product-item">
      <app-pizza-form
        [pizza]="pizza$ | async"
        [toppings]="toppings$ | async"
        (selected)="onSelect($event)"
        (create)="onCreate($event)"
        (update)="onUpdate($event)"
        (remove)="onRemove($event)">
        <app-pizza-display
          [pizza]="visualise$ | async">
        </app-pizza-display>
      </app-pizza-form>
    </div>
  `
})
export class ProductItemComponent implements OnInit {
  pizza$: Observable<Pizza>;
  visualise$: Observable<Pizza>;
  toppings$: Observable<Topping[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.pizza$ = this.store.select(PizzasState.getSelectedPizza).pipe(
      tap((pizza: Pizza = null) => {
        const pizzaExists = !!(pizza && pizza.toppings);
        const toppings = pizzaExists ? pizza.toppings.map(topping => topping.id) : [];
        this.store.dispatch(new VisualizeToppings(toppings));
      })
    );
    this.toppings$ = this.store.select(ToppingsState.getALlToppings);
    this.visualise$ = this.store.select(PizzasState.getPizzaVisualized);
  }

  onSelect(event: number[]) {
    // this.store.dispatch(new VisualizeToppings(event));
  }

  onCreate(event: Pizza) {
    this.store.dispatch(new CreatePizza(event));
  }

  onUpdate(event: Pizza) {
    this.store.dispatch(new UpdatePizza(event));
  }

  onRemove(event: Pizza) {
    const remove = window.confirm('Are you sure?');
    if (remove) {
      this.store.dispatch(new DeletePizza(event));
    }
  }
}
