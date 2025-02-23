export type Transformer<TInput, TOutput> = (item: TInput, index: number, array: Array<TInput>) => TOutput;
