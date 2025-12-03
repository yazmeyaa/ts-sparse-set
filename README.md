### TS SparseSet

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

**TS SparseSet** is a high-performance TypeScript data structure implementing a *sparse set*, providing constant-time operations and cache-friendly dense storage. Ideal for ECS architectures, game engines, simulations, and any ID-indexed data.

---

## Features

* **O(1) Operations:** `add`, `remove`, `has`, `get`, `ensure`, and index lookups.
* **Dense Storage:** Compact arrays for optimal data locality and iteration speed.
* **Swap-Remove Semantics:** Maintains dense compactness after deletions without gaps.
* **Full Iteration Support:** Native iterators, `values()`, `ids()`, `entries()`, `forEach()`.
* **Zero-GC Hot Path:** No intermediate allocations in iteration modes.
* **TypeScript Native:** Fully typed, generic, and safe.

---

## Installation

```bash
npm install ts-sparse-set
```

---

## Usage Example

```ts
import { SparseSet } from 'ts-sparse-set';

const set = new SparseSet<number>();

set.add(10, 42);
set.add(20, 100);

console.log(set.has(10)); // true
console.log(set.get(20)); // 100

set.add(10, 77);
console.log(set.get(10)); // 77

set.remove(20);
console.log(set.has(20)); // false

// Iteration (dense order)
for (const entry of set) {
  console.log(entry.id, entry.value);
}

// Using ensure(...)
const v = set.ensure(50, () => 123);
console.log(v); // 123

// Utility iteration helpers
console.log([...set.ids()]);    // [10, 50]
console.log([...set.values()]); // [77, 123]
console.log(set.size());        // 2
```

---

## API Documentation

### `class SparseSet<V>`

#### Core Methods

| Method                             | Description                                         |
| ---------------------------------- | --------------------------------------------------- |
| **`add(id: number, value: V): V`** | Inserts a new value or replaces an existing one.    |
| **`get(id: number): V \| null`**   | Retrieves a value or returns `null` if not present. |
| **`has(id: number): boolean`**     | Checks if an element exists.                        |
| **`remove(id: number): void`**     | Removes the element using O(1) swap-remove logic.   |
| **`size(): number`**               | Returns the number of elements stored.              |
| **`clear(): void`**                | Removes all elements.                               |

#### Iteration Helpers

| Method                                  | Description                                             |
| --------------------------------------- | ------------------------------------------------------- |
| **`[Symbol.iterator]()`**               | Iterates over `{ id, value }` entries in dense order.   |
| **`ids(): Generator<number>`**          | Iterates over all ids.                                  |
| **`values(): Generator<V>`**            | Iterates over all values.                               |
| **`entries(): Generator<[number, V]>`** | Iterates over `[id, value]` tuples.                     |
| **`forEach(fn)`**                       | Efficient callback-based iteration without allocations. |

#### Utility Methods

| Method                                        | Description                                         |
| --------------------------------------------- | --------------------------------------------------- |
| **`ensure(id: number, factory: () => V): V`** | Returns existing value or inserts a new one lazily. |
| **`tryGetIndex(id: number): number`**         | Returns dense index or `-1` if id does not exist.   |

---

## Benchmarks

**Tested on:**  
- CPU: AMD Ryzen 7 7700 (8-core, up to 5.4 GHz)  
- RAM: 32 GB DDR5-5600  
- OS: Windows 11 Pro  
- Runtime: Node.js v24.11.1 (tsx)  
- Set size: **1,000,000** entities

| Operation                    | Throughput (ops/sec)       | Per-operation latency |
|------------------------------|----------------------------|-----------------------|
| `add()`                      | **30.0 – 31.0 million**    | ~32–34 ns             |
| `has()`                      | **9.7 – 9.9 million**      | ~101–103 ns           |
| `get()`                      | **7.6 – 7.7 million**      | ~130–132 ns           |
| `remove()` (swap-remove)     | **13.0 – 13.9 million**    | ~72–77 ns             |
| `ensure(id, factory)`        | **4.0 million**            | ~250 ns               |
| `size()`                     | **>526 million**           | **~1.9 ns**           |
| `forEach()` (1M elements)    | **191–193 passes/sec**     | **~5.2 ms**           |
| `ids()` / `values()`         | **64–65 passes/sec**       | ~15.4–15.6 ms         |
| Generator iteration          | **54–55 passes/sec**       | ~18–19 ms             |

## When to Use SparseSet

SparseSet excels when:

* IDs are numeric and bounded.
* You need fast add/remove with compact dense data.
* You rely heavily on iteration speed (ECS, physics, grids, pools).
* You want predictable memory layout and minimal GC pressure.

It is **not** a general-purpose map or associative container — it is optimized for performance-critical numeric ID use cases.

---

## Contributing

Issues, PRs, and suggestions are welcome.
Project repository: **[https://github.com/yazmeyaa/ts-sparse-set](https://github.com/yazmeyaa/ts-sparse-set)**

---

[npm-image]: https://img.shields.io/npm/v/ts-sparse-set.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ts-sparse-set
[downloads-image]: https://img.shields.io/npm/dm/ts-sparse-set.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/ts-sparse-set
