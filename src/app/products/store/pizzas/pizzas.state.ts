import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Pizza } from '../../models/pizza.model';
import { PizzasService } from '../../services';
import { LoadPizzas, CreatePizza, UpdatePizza, DeletePizza, SelectPizza } from './pizzas.actions';
import { ToppingsState, ToppingsStateModel } from '../toppings/toppings.state';

export interface PizzasStateModel {
  entities: { [id: number]: Pizza };
  loaded: boolean;
  loading: boolean;
  selectedPizzaId: number;
}

@State<PizzasStateModel>({
  name: 'pizzas',
  defaults: {
    entities: {},
    loaded: false,
    loading: false,
    selectedPizzaId: null
  }
})
export class PizzasState {
  constructor(private pizzaService: PizzasService) {}

  @Selector()
  static getAllPizzas(state: PizzasStateModel) {
    return Object.keys(state.entities).map(id => state.entities[+id]);
  }

  @Selector()
  static getSelectedPizza(state: PizzasStateModel) {
    return state.entities[state.selectedPizzaId];
  }

  @Selector([ToppingsState])
  static getPizzaVisualized(state: PizzasStateModel, toppingsState: ToppingsStateModel) {
    const toppings = toppingsState.selectedToppings.map(id => toppingsState.entities[id]);
    return { ...state.entities[state.selectedPizzaId], toppings };
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

  @Action(SelectPizza)
  selectPizza({ patchState }: StateContext<PizzasStateModel>, action: SelectPizza) {
    patchState({ selectedPizzaId: action.payload });
  }

  @Action(CreatePizza)
  createPizza(
    { patchState, getState, dispatch }: StateContext<PizzasStateModel>,
    action: CreatePizza
  ) {
    return this.pizzaService.createPizza(action.payload).pipe(
      tap(pizza => {
        const state = getState();
        const entities = {
          ...state.entities,
          [pizza.id]: pizza
        };
        patchState({ entities });
        dispatch(new Navigate(['/products', pizza.id]));
      })
    );
  }

  @Action(UpdatePizza)
  updatePizza(
    { patchState, getState, dispatch }: StateContext<PizzasStateModel>,
    action: UpdatePizza
  ) {
    return this.pizzaService.updatePizza(action.payload).pipe(
      tap(pizza => {
        const state = getState();
        const entities = {
          ...state.entities,
          [pizza.id]: pizza
        };
        patchState({ entities });
        dispatch(new Navigate(['/products']));
      })
    );
  }

  @Action(DeletePizza)
  deletePizza(
    { patchState, getState, dispatch }: StateContext<PizzasStateModel>,
    action: DeletePizza
  ) {
    return this.pizzaService.removePizza(action.payload).pipe(
      tap(pizza => {
        const state = getState();
        const { [pizza.id]: removed, ...entities } = state.entities;
        patchState({ entities });
        dispatch(new Navigate(['/products']));
      })
    );
  }
}
