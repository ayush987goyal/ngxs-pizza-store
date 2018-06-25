import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { ToppingsService } from '../../services';
import { Topping } from '../../models/topping.model';
import { LoadToppings, VisualizeToppings } from './toppings.actions';

export interface ToppingsStateModel {
  entities: { [id: number]: Topping };
  loaded: boolean;
  loading: boolean;
  selectedToppings: number[];
}

@State<ToppingsStateModel>({
  name: 'toppings',
  defaults: {
    entities: {},
    loaded: false,
    loading: false,
    selectedToppings: []
  }
})
export class ToppingsState {
  constructor(private toppingsService: ToppingsService) {}

  @Selector()
  static getALlToppings(state: ToppingsStateModel) {
    return Object.keys(state.entities).map(id => state.entities[+id]);
  }

  @Selector()
  static getSelectedToppings(state: ToppingsStateModel) {
    return state.selectedToppings;
  }

  @Action(LoadToppings)
  loadToppings({ getState, patchState, setState }: StateContext<ToppingsStateModel>) {
    patchState({ loading: true });
    return this.toppingsService.getToppings().pipe(
      tap(toppings => {
        const state = getState();
        const newEntities = toppings.reduce(
          (entities: { [id: number]: Topping }, topping: Topping) => {
            return {
              ...entities,
              [topping.id]: topping
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

  @Action(VisualizeToppings)
  visualizeToppings({ patchState }: StateContext<ToppingsStateModel>, action: VisualizeToppings) {
    patchState({ selectedToppings: action.payload });
  }
}
