### TS SparseSet

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

**TS SparseSet** — это высокопроизводительная TypeScript структура данных, реализующая *sparse set*, позволяющая хранить и быстро управлять ID-ориентированными коллекциями и компонентами ECS.

#### Features

* **O(1) Operations:** `add`, `remove`, `get`, and `has` с плотным хранением элементов.
* **Dense Storage:** Эффективная плотная память для максимальной производительности и locality.
* **Swap-Remove:** При удалении элементов массив остаётся компактным.
* **Reusable Structure:** Может использоваться для ECS-компонентов, сущностей, пулов объектов или других ID-ориентированных коллекций.
* **Optional Object Pool Integration:** Лёгкая интеграция с пулами объектов для минимизации аллокаций.
* **TypeScript Native:** Полная типизация и совместимость с современным TS.

#### Installation

```bash
npm install ts-sparse-set
```

#### Usage Example

```typescript
import { SparseSet } from 'ts-sparse-set';

// Создаём новый SparseSet для чисел
const set = new SparseSet<number>();

// Добавляем элементы
set.add(10, 42);
set.add(20, 100);

// Проверяем наличие
console.log(set.has(10)); // true
console.log(set.has(5));  // false

// Получаем значение
console.log(set.get(20)); // 100

// Перезаписываем значение
set.add(10, 50);
console.log(set.get(10)); // 50

// Удаляем элемент
set.remove(20);
console.log(set.has(20)); // false

// Добавляем несколько элементов и проверяем плотность
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

    * `add(id: number, value: V): V` — добавляет новый элемент или обновляет существующий.
    * `get(id: number): V | null` — возвращает элемент по ID или `null`.
    * `has(id: number): boolean` — проверяет наличие элемента.
    * `remove(id: number): void` — удаляет элемент и поддерживает плотность dense массива.

#### Note

SparseSet идеально подходит для ECS-сценариев, где сущности и компоненты идентифицируются числами. Эта структура не является обычным Map/Set и оптимизирована под плотные массивы с минимальной стоимостью операций.

---

Feel free to contribute, report issues, or suggest improvements on [GitHub](https://github.com/yazmeyaa/ts-sparse-set).

[npm-image]: https://img.shields.io/npm/v/ts-sparse-set.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ts-sparse-set
[downloads-image]: https://img.shields.io/npm/dm/ts-sparse-set.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/ts-sparse-set