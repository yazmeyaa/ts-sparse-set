export class SparseSet<V> {
  private sparse: number[] = [];
  private dense: number[] = [];
  private data: V[] = [];

  public has(id: number): boolean {
    const index = this.sparse[id];
    return (
      index !== undefined &&
      index < this.dense.length &&
      this.dense[index] === id
    );
  }

  public get(id: number): V | null {
    const index = this.sparse[id];
    if (
      index === undefined ||
      index >= this.dense.length ||
      this.dense[index] !== id
    ) {
      return null;
    }
    return this.data[index];
  }

  public add(id: number, value: V): V {
    const existing = this.sparse[id];
    if (
      existing !== undefined &&
      existing < this.dense.length &&
      this.dense[existing] === id
    ) {
      this.data[existing] = value;
      return value;
    }

    const index = this.dense.length;
    this.dense[index] = id;
    this.data[index] = value;

    if (this.sparse.length <= id) {
      this.sparse.length = id + 1;
    }

    this.sparse[id] = index;

    return value;
  }

  public remove(id: number): void {
    const index = this.sparse[id];
    if (
      index === undefined ||
      index >= this.dense.length ||
      this.dense[index] !== id
    ) {
      return;
    }

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
}
