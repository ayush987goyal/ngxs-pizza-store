import { Pizza } from '../../models/pizza.model';

export class LoadPizzas {
  static readonly type = '[Products] Load Pizzas';
}

export class SelectPizza {
  static readonly type = '[Products] Select Pizza';
  constructor(public payload: number) {}
}

export class CreatePizza {
  static readonly type = '[Products] Create Pizza';
  constructor(public payload: Pizza) {}
}

export class UpdatePizza {
  static readonly type = '[Products] Update Pizza';
  constructor(public payload: Pizza) {}
}

export class DeletePizza {
  static readonly type = '[Products] Delete Pizza';
  constructor(public payload: Pizza) {}
}
