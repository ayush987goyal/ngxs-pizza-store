import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Pizza } from '../../models/pizza.model';
import { PizzasService } from '../../services';
import { LoadPizzas } from './pizzas.actions';

export interface PizzasStateModel {
  entities: { [id: number]: Pizza };
  loaded: boolean;
  loading: boolean;
}

@State<PizzasStateModel>({
  name: 'pizzas',
  defaults: {
    entities: {},
    loaded: false,
    loading: false
  }
})
export class PizzasState {
  constructor(private pizzaService: PizzasService) {}

  @Selector()
  static getAllPizzas(state: PizzasStateModel) {
    return Object.keys(state.entities).map(id => state.entities[+id]);
  }

  @Action(LoadPizzas)
  loadPizzas({ patchState, getState, setState }: StateContext<PizzasStateModel>) {
    patchState({ loading: true });
    return this.pizzaService.getPizzas().pipe(
      tap(pizzas => {
        const state = getState();
        const newEntities = pizzas.reduce(
          (entities: { [id: number]: Pizza }, pizza: Pizza) => {
            return {
              ...entities,
              [pizza.id]: pizza
            };
          },
          {
            ...state.entities
          }
        );

        setState({
          ...state,
          loading: false,
          loaded: true,
          entities: newEntities
        });
      }),
      catchError(error => {
        patchState({ loading: false, loaded: false });
        return of(error);
      })
    );
  }
}