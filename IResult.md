## Functions

<dl>
<dt><a href="#isResult">isResult(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Type guard for IResult</p></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ok">ok</a> ⇒ <code>ReturnType</code> | <code>undefined</code></dt>
<dd><p><strong>Ok()</strong> method to try to get value, otherwise return undefined</p></dd>
<dt><a href="#isOk">isOk</a> ⇒ <code>boolean</code></dt>
<dd><p><strong>isOk()</strong> method to check that result is not an error</p></dd>
<dt><a href="#err">err</a> ⇒ <code>ErrorType</code> | <code>undefined</code></dt>
<dd><p><strong>err()</strong> method to try to get the error, otherwise return undefined</p></dd>
<dt><a href="#isErr">isErr</a> ⇒ <code>boolean</code></dt>
<dd><p><strong>isErr()</strong> method to check that result is an error</p></dd>
<dt><a href="#unwrap">unwrap</a> ⇒ <code>ReturnType</code></dt>
<dd><p><strong>unwrap()</strong> method to unwrap the value, if it is an error, throws the error</p></dd>
<dt><a href="#unwrapOrDefault">unwrapOrDefault</a> ⇒ <code>ReturnType</code></dt>
<dd><p><strong>unwrapOrDefault()</strong> method to unwrap the value, if it is an error, return the default value</p></dd>
</dl>

## Interfaces

<dl>
<dt><a href="#IResult">IResult</a></dt>
<dd><p>IResult interface</p></dd>
</dl>

<a name="IResult"></a>

## IResult
<p>IResult interface</p>

**Kind**: global interface  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ok | [<code>ok</code>](#ok) | <p>method to try to get value, otherwise return undefined</p> |
| isOk | [<code>isOk</code>](#isOk) | <p>method to check that result is not an error</p> |
| err | [<code>err</code>](#err) | <p>method to try to get the error, otherwise return undefined</p> |
| isErr | [<code>isErr</code>](#isErr) | <p>method to check that result is an error</p> |
| unwrap | [<code>unwrap</code>](#unwrap) | <p>method to unwrap the value, if it is an error, throws the error</p> |
| unwrapOrDefault | [<code>unwrapOrDefault</code>](#unwrapOrDefault) | <p>method to unwrap the value, if it is an error, return the default value</p> |

<a name="isResult"></a>

## isResult(value) ⇒ <code>boolean</code>
<p>Type guard for IResult</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>unknown</code> | <p>unknown value</p> |

<a name="ok"></a>

## ok ⇒ <code>ReturnType</code> \| <code>undefined</code>
<p><strong>Ok()</strong> method to try to get value, otherwise return undefined</p>

**Kind**: global typedef  
**Example**  
```js
const result: IResult = new Ok(1);
result.ok(); // 1
```
<a name="isOk"></a>

## isOk ⇒ <code>boolean</code>
<p><strong>isOk()</strong> method to check that result is not an error</p>

**Kind**: global typedef  
**Example**  
```js
const result: IResult = new Ok(1);
result.isOk(); // true
```
<a name="err"></a>

## err ⇒ <code>ErrorType</code> \| <code>undefined</code>
<p><strong>err()</strong> method to try to get the error, otherwise return undefined</p>

**Kind**: global typedef  
**Example**  
```js
const result: IResult = new Err(new Error('error'));
result.err(); // Error('error')
```
<a name="isErr"></a>

## isErr ⇒ <code>boolean</code>
<p><strong>isErr()</strong> method to check that result is an error</p>

**Kind**: global typedef  
**Example**  
```js
const result: IResult = new Err(new Error('error'));
result.isErr(); // true
```
<a name="unwrap"></a>

## unwrap ⇒ <code>ReturnType</code>
<p><strong>unwrap()</strong> method to unwrap the value, if it is an error, throws the error</p>

**Kind**: global typedef  
**Throws**:

- <code>ErrorType</code> 

**Example**  
```js
const result: IResult = new Ok(1);
result.unwrap(); // 1
```
<a name="unwrapOrDefault"></a>

## unwrapOrDefault ⇒ <code>ReturnType</code>
<p><strong>unwrapOrDefault()</strong> method to unwrap the value, if it is an error, return the default value</p>

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>ReturnType</code> | <p>default value</p> |

**Example**  
```js
const result: IResult = new Err(new Error('error'));
result.unwrapOrDefault(1); // 1
```
