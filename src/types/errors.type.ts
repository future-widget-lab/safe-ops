export type ErrorReport<TInput> = { error: Error; item: TInput; index: number };

export type OnError<TInput> = (error: unknown, item: TInput, index: number) => void;
