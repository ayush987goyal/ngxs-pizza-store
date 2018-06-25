export class LoadToppings {
  static readonly type = '[Products] Load Toppings';
}

export class VisualizeToppings {
  static readonly type = '[Products] Visualize Topppings';
  constructor(public payload: number[]) {}
}
