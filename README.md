# mharj-result

A lightweight library for representing the Rust style Result class for function callback or promise in TypeScript/JavaScript.

## install

```bash
npm install mharj-result
```

## usage

With builder functions

```typescript
import {safeResult, safeAsyncResult} from 'mharj-result';

const testFunction = safeResult((value: string) => {
	if (value === 'error') {
		throw new Error('oops');
	}
	return value;
});
// wrap fs function to SyncResult
const accessSync = safeResult(fs.accessSync); 

const testPromiseFunction = safeAsyncResult(async (value: string) => {
	if (value === 'error') {
		throw new Error('oops');
	}
	return value;
});
// wrap fs/promises function to AsyncResult
const writeFile = safeAsyncResult(fsPromise.writeFile);
```

With direct class usage

```typescript
import PromiseResult from 'mharj-result';

const result = PromiseResult.from<string>(Promise.resolve(value));
await expect(result.isOk()).to.be.eventually.true;
await expect(result.isErr()).to.be.eventually.false;
await expect(result.ok()).to.be.eventually.equal(value);
await expect(result.err()).to.be.eventually.equal(undefined);
await expect(result.unwrap()).to.be.eventually.equal(value);
await expect(result.unwrapOrDefault('world')).to.be.eventually.equal(value);

const result = PromiseResult.from<string>(Promise.reject(new Error('oops')));
await expect(result.isOk()).to.be.eventually.false;
await expect(result.isErr()).to.be.eventually.true;
await expect(result.ok()).to.be.eventually.equal(undefined);
await expect(result.err()).to.be.eventually.eql(error);
await expect(result.unwrap()).to.be.eventually.rejectedWith(error);
await expect(result.unwrapOrDefault('world')).to.be.eventually.equal('world');
```

```typescript
import FunctionResult from 'mharj-result';

const result = FunctionResult.from<string>(() => value);
expect(result.isOk()).to.be.true;
expect(result.isErr()).to.be.false;
expect(result.ok()).to.be.equal(value);
expect(result.err()).to.be.equal(undefined);
expect(result.unwrap()).to.be.equal(value);
expect(result.unwrapOrDefault('world')).to.be.equal(value);

const result = FunctionResult.from<string>(() => {
	throw new Error('oops');
});
expect(result.isOk()).to.be.false;
expect(result.isErr()).to.be.true;
expect(result.ok()).to.be.equal(undefined);
expect(result.err()).to.be.eql(error);
expect(() => result.unwrap()).to.throw(error);
expect(result.unwrapOrDefault('world')).to.be.equal('world');
```
