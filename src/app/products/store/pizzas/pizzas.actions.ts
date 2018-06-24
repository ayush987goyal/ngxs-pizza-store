import { Pizza } from '../../models/pizza.model';

export class LoadPizzas {
  static readonly type = '[Products] Load Pizzas';
}

export class CreatePizza {
  readonly type = '[Products] Create Pizza';
  constructor(public payload: Pizza) {}
}

export class UpdatePizza {
  readonly type = '[Products] Update Pizza';
  constructor(public payload: Pizza) {}
}

export class DeletePizza {
  readonly type = '[Products] Delete Pizza';
  constructor(public payload: Pizza) {}
}
