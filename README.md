# mharj-result

A lightweight library for representing the Rust style Result class for function callback or promise in TypeScript/JavaScript.

## install

```bash
npm install mharj-result
```

## [Documentation](./docs/)

## usage

With builder functions

```typescript
import {safeResultBuilder, safeAsyncResultBuilder} from 'mharj-result';

const testFunction = safeResultBuilder((value: string) => {
	if (value === 'error') {
		throw new Error('oops');
	}
	return value;
});
// wrap fs function to return IResult
const accessSync = safeResultBuilder(fs.accessSync);

const testPromiseFunction = safeAsyncResultBuilder(async (value: string) => {
	if (value === 'error') {
		throw new Error('oops');
	}
	return value;
});
// wrap fs/promises function to return Promise<IResult>
const writeFile = safeAsyncResultBuilder(fsPromise.writeFile);
```

With safeAsyncResult wrapper

```typescript
import {safeAsyncResult} from 'mharj-result';
const value = 'hello';
const result = await safeAsyncResult<string>(Promise.resolve(value)); // or () => Promise.resolve(value))
expect(result.isOk()).to.be.true;
expect(result.isErr()).to.be.false;
expect(result.ok()).to.be.equal(value); // gets the value or undefined if error
expect(result.err()).to.be.equal(undefined); // gets the error or undefined if value is ok
expect(result.unwrap()).to.be.equal(value); // gets the value or throws the error
expect(result.unwrapOrDefault('world')).to.be.equal(value); // gets the value or default value if error
```

Direct Result usage (Promises need handle all errors as Err objects, else use safe functions)

```typescript
import {Ok, Err, IResult} from 'mharj-result';

async function demo(): Promise<IResult<string, unknown>> {
	try {
		const loadString: string = await xxyyLoading....
		return new Ok(loadString);
	} catch (error) {
		return new Err(error);
	}
}

const result: IResult<string, unknown> = await demo();
if (result.isOk()) {
	console.debug(result.ok());
} else {
	console.error(result.err());
}
const data = result.unwrap(); // gets the value or throws the error
```
