export type Reducer<TInput, TOutput> = (
	accumulator: TOutput,
	currentValue: TInput,
	index: number,
	array: Array<TInput>
) => TOutput;
