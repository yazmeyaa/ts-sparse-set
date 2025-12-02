### TS SparseSet

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

**TS SparseSet** is a high-performance TypeScript data structure implementing a *sparse set*, enabling fast management of ID-based collections and ECS components.

#### Features

* **O(1) Operations:** `add`, `remove`, `get`, and `has` with dense storage.
* **Dense Storage:** Efficient memory layout for maximum performance and cache locality.
* **Swap-Remove:** Maintains a compact dense array after removals.
* **Reusable Structure:** Suitable for ECS components, entities, object pools, or other ID-based collections.
* **Optional Object Pool Integration:** Easy integration with object pools to minimize allocations.
* **TypeScript Native:** Fully typed and compatible with modern TypeScript.

#### Installation

```bash
npm install ts-sparse-set
```

#### Usage Example

```typescript
import { SparseSet } from 'ts-sparse-set';

// Create a new SparseSet for numbers
const set = new SparseSet<number>();

// Add elements
set.add(10, 42);
set.add(20, 100);

// Check existence
console.log(set.has(10)); // true
console.log(set.has(5));  // false

// Get element by ID
console.log(set.get(20)); // 100

// Overwrite existing value
set.add(10, 50);
console.log(set.get(10)); // 50

// Remove an element
set.remove(20);
console.log(set.has(20)); // false

// Add multiple elements and check dense array integrity
set.add(30, 300);
set.add(40, 400);
set.remove(10);
console.log(set.get(30)); // 300
console.log(set.get(40)); // 400
```

#### API Documentation

* **SparseSet Class**

  * **Constructor:** `new SparseSet<V>()`
  * **Methods:**

    * `add(id: number, value: V): V` — adds a new element or updates an existing one.
    * `get(id: number): V | null` — retrieves the element by ID or `null` if missing.
    * `has(id: number): boolean` — checks if an element exists.
    * `remove(id: number): void` — removes an element and keeps the dense array compact.

#### Note

SparseSet is ideal for ECS scenarios where entities and components are identified by numeric IDs. It is not a general-purpose Map/Set and is optimized for dense arrays and minimal operation cost.

Good luck!

---

Feel free to contribute, report issues, or suggest improvements on [GitHub](https://github.com/yazmeyaa/ts-sparse-set).

[npm-image]: https://img.shields.io/npm/v/ts-sparse-set.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ts-sparse-set
[downloads-image]: https://img.shields.io/npm/dm/ts-sparse-set.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/ts-sparse-set
