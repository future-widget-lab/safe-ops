# @future-widget-lab/safe-ops

A collection of helper functions that ensure operations never fail, even if an error occurs within a callback function. These helpers wrap standard methods in a `try-catch` block, allowing execution to continue even when errors arise.

## Features

- Prevents entire operations from failing due to individual errors.
- Safe alternatives to common array methods.
- `-with-errors` variants for the common array methods that return both results and error reports.

## Installation

```sh
npm install @future-widget-lab/safe-ops
```

## Usage

### `safeguard`

Use this helper to safeguard against falsey values

```typescript
import { safeguard } from '@future-widget-lab/safe-ops';

const values = [0, 1, '', 'hello', null, undefined, false, [], {}];

const truthy = values.filter(safeguard);

console.log(truthy); // Output: [1, 'hello', [], {}]
```

### `attempt`

Use this helper to safely executes a function and catch any errors that occur.

```typescript
import { attempt } from '@future-widget-lab/safe-ops';

const riskyOperation = () => JSON.parse('invalid json');

const output = attempt(riskyOperation);

if (output.ok) {
	console.log('Success:', output.result);
} else {
	console.error('Error occurred:', output.error);
}
```

### `safeEvery`

Use this helper to determine whether all the members of an array satisfy the specified test, even if an error occurs in some iterations.

```typescript
import { safeEvery } from '@future-widget-lab/safe-ops';

const numbers = [1, 2, 3, 4, 5];
const allEven = safeEvery(numbers, (num) => {
	if (num === 3) {
		throw new Error('Unexpected number!');
	}

	return num % 2 === 0;
});

console.log(allEven); // false
```

### `safeFilter`

Use this helper to return the elements of an array that meet the condition specified in a callback function, even if some callbacks throw errors.

```typescript
import { safeFilter } from '@future-widget-lab/safe-ops';

const numbers = [1, 2, 3, 4, 5];
const filtered = safeFilter(numbers, (num) => {
	if (num === 3) {
		throw new Error('Error processing!');
	}

	return num % 2 === 0;
});

console.log(filtered); // [2, 4]
```

### `safeFind`

Use this helper to return the first element in the array where the predicate is true, even if an error occurs.

```typescript
import { safeFind } from '@future-widget-lab/safe-ops';

const numbers = [1, 2, 3, 4, 5];
const found = safeFind(numbers, (num) => {
	if (num === 2) {
		throw new Error('Failure!');
	}

	return num > 3;
});

console.log(found); // 4
```

### `safeFindIndex`

Use this helper to return the index of the first element where the predicate is true, even if some iterations fail.

```typescript
import { safeFindIndex } from '@future-widget-lab/safe-ops';

const numbers = [1, 2, 3, 4, 5];
const index = safeFindIndex(numbers, (num) => {
	if (num === 2) {
		throw new Error('Error here!');
	}

	return num > 3;
});

console.log(index); // 3
```

### `safeForEach`

Use this helper to execute a function for each element in an array without stopping on errors.

```typescript
import { safeForEach } from '@future-widget-lab/safe-ops';

const numbers = [1, 2, 3, 4, 5];
safeForEach(numbers, (num) => {
	if (num === 3) {
		throw new Error('Processing failed!');
	}

	console.log(num);
});

// 1, 2, 4, 5 (skips 3 due to error but continues)
```

### `safeMap`

Use this helper to transform an array into a new array while handling errors gracefully.

```typescript
import { safeMap } from '@future-widget-lab/safe-ops';

const numbers = [1, 2, 3, 4, 5];
const mapped = safeMap(numbers, (num) => {
	if (num === 4) {
		throw new Error('Error transforming!');
	}

	return num * 2;
});

console.log(mapped); // [2, 4, 6, 10]
```

### `safeReduce`

Use this helper to accumulate a result from an array, ensuring errors don't interrupt execution.

```typescript
import { safeReduce } from '@future-widget-lab/safe-ops';

const numbers = [1, 2, 3, 4, 5];
const sum = safeReduce(
	numbers,
	(acc, num) => {
		if (num === 3) {
			throw new Error('Summation error!');
		}

		return acc + num;
	},
	0
);

console.log(sum); // 12
```

### `safeSome`

Use this helper to determine whether at least one element in the array satisfies the specified test, even if an error occurs.

```typescript
import { safeSome } from '@future-widget-lab/safe-ops';

const numbers = [1, 2, 3, 4, 5];
const hasEven = safeSome(numbers, (num) => {
	if (num === 3) {
		throw new Error('Failure!');
	}

	return num % 2 === 0;
});

console.log(hasEven); // true
```

## `-with-errors` Variants

The `-with-errors` variants return both results and an `errors` array containing details of failed items.

```typescript
import { safeMapWithErrors } from '@future-widget-lab/safe-ops';

const numbers = [1, 2, 3, 4, 5];
const { result, errors } = safeMapWithErrors(numbers, (num) => {
	if (num === 4) {
		throw new Error('Error mapping!');
	}

	return num * 2;
});

console.log(result); // [2, 4, 6, 10]
console.log(errors); // [{ error: [Error: Error mapping!], item: 4, index: 3 }]
```

## Important Note

`safeMap` (and similar array helpers) operate synchronously and do not handle asynchronous transformations. If you pass an async function, the result will be an array of unresolved promises, just like with Array.prototype.map.

For asynchronous cases, consider using `Promise.all`, `p-map`, or manually handling errors within your async function.

## License

MIT
