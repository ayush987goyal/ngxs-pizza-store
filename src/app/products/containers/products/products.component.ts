import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Pizza } from '../../models/pizza.model';
import { PizzasState } from '../../store/pizzas/pizzas.state';
import { LoadPizzas } from '../../store/pizzas/pizzas.actions';
import { LoadToppings } from '../../store/toppings/toppings.actions';

@Component({
  selector: 'app-products',
  styleUrls: ['products.component.scss'],
  template: `
    <div class="products">
      <div class="products__new">
        <a
          class="btn btn__ok"
          routerLink="./new">
          New Pizza
        </a>
      </div>
      <div class="products__list">
        <div *ngIf="!((pizzas$ | async)?.length)">
          No pizzas, add one to get started.
        </div>
        <app-pizza-item
          *ngFor="let pizza of (pizzas$ | async)"
          [pizza]="pizza">
        </app-pizza-item>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  @Select(PizzasState.getAllPizzas) pizzas$: Observable<Pizza[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new LoadPizzas());
    this.store.dispatch(new LoadToppings());
  }
}
