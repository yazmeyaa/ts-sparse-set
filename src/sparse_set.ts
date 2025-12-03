/**
 * A pair of (id, value) returned by the SparseSet iterator.
 */
export type SparseSetEntry<V> = {
  value: V;
  id: number;
};

/**
 * SparseSet — a constant-time set/map structure using sparse/dense indexing.
 * Provides O(1) add, remove, has, and get operations while keeping values packed densely.
 */
export class SparseSet<V> {
  private sparse: number[] = [];
  private dense: number[] = [];
  private data: V[] = [];

  private growSparse(minId: number): void {
    if (minId < this.sparse.length) return;

    let newLen = this.sparse.length === 0 ? 1024 : this.sparse.length * 2;
    while (newLen <= minId) newLen *= 2;

    this.sparse.length = newLen;
  }

  /**
   * Checks whether an item with the given id exists in the set.
   *
   * @param id - The element identifier.
   * @returns True if the element exists, false otherwise.
   */
  public has(id: number): boolean {
    const index = this.sparse[id];
    return index !== undefined && this.dense[index] === id;
  }

  /**
   * Retrieves the value associated with the given id.
   *
   * @param id - The element identifier.
   * @returns The value if present, otherwise null.
   */
  public get(id: number): V | null {
    const index = this.sparse[id];
    return index !== undefined && this.dense[index] === id
      ? this.data[index]
      : null;
  }
  /**
   * Adds or updates an element with the specified id.
   * If the id already exists, its value is overwritten.
   *
   * @param id - The element identifier.
   * @param value - The element value.
   * @returns The stored value.
   */
  public add(id: number, value: V): V {
    const existing = this.sparse[id];
    if (existing !== undefined && this.dense[existing] === id) {
      this.data[existing] = value;
      return value;
    }

    const index = this.dense.length;

    this.dense[index] = id;
    this.data[index] = value;

    this.growSparse(id);
    this.sparse[id] = index;

    return value;
  }

  /**
   * Removes the element with the given id.
   * Performs a swap with the last dense element to maintain O(1) removal.
   *
   * @param id - The element identifier to remove.
   */
  public remove(id: number): void {
    const index = this.sparse[id];
    if (index === undefined || this.dense[index] !== id) return;

    const lastIndex = this.dense.length - 1;
    const lastId = this.dense[lastIndex];

    if (index !== lastIndex) {
      this.dense[index] = lastId;
      this.data[index] = this.data[lastIndex];
      this.sparse[lastId] = index;
    }

    this.dense.pop();
    this.data.pop();
    delete this.sparse[id];
  }

  /**
   * Iterates over all entries in dense order.
   *
   * @returns A generator yielding { id, value } objects.
   */
  public *[Symbol.iterator](): Generator<SparseSetEntry<V>> {
    const len = this.dense.length;
    for (let i = 0; i < len; i++) {
      yield {
        id: this.dense[i],
        value: this.data[i],
      };
    }
  }

  /**
   * Returns the number of stored elements.
   *
   * @returns Total element count.
   */
  public get size(): number {
    return this.dense.length;
  }

  /**
   * Removes all elements from the set.
   */
  public clear(): void {
    this.sparse.length = 0;
    this.dense.length = 0;
    this.data.length = 0;
  }

  /**
   * Iterates over all ids in dense order.
   *
   * @returns A generator yielding element ids.
   */
  public *ids(): Generator<number> {
    for (let i = 0; i < this.dense.length; i++) yield this.dense[i];
  }

  /**
   * Iterates over all values in dense order.
   *
   * @returns A generator yielding element values.
   */
  public *values(): Generator<V> {
    for (let i = 0; i < this.data.length; i++) yield this.data[i];
  }

  /**
   * Iterates over all entries as [id, value] tuples.
   *
   * @returns A generator yielding [id, value] pairs.
   */
  public *entries(): Generator<[number, V]> {
    for (let i = 0; i < this.dense.length; i++)
      yield [this.dense[i], this.data[i]];
  }

  /**
   * Applies a callback to each element in dense order.
   *
   * @param fn - A function receiving (value, id).
   */
  public forEach(fn: (value: V, id: number) => void): void {
    for (let i = 0; i < this.dense.length; i++) {
      fn(this.data[i], this.dense[i]);
    }
  }

  /**
   * Ensures an element exists for the given id.
   * If present, returns it. Otherwise, creates a new one using the factory.
   *
   * @param id - Element identifier.
   * @param factory - Function creating a value if the id is missing.
   * @returns The existing or newly created value.
   */
  public ensure(id: number, factory: () => V): V {
    let index = this.sparse[id];
    if (index !== undefined && this.dense[index] === id) {
      return this.data[index];
    }

    const value = factory();
    index = this.dense.length;

    this.dense[index] = id;
    this.data[index] = value;

    this.growSparse(id);
    this.sparse[id] = index;

    return value;
  }

  /**
   * Returns the dense index of the element with the given id.
   * Primarily useful for low-level optimizations.
   *
   * @param id - Element identifier.
   * @returns The dense index or -1 if the id does not exist.
   */
  public tryGetIndex(id: number): number {
    const idx = this.sparse[id];
    return idx !== undefined && this.dense[idx] === id ? idx : -1;
  }
}
