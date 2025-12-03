import { SparseSet } from "./sparse_set";

describe("SparseSet", () => {
  let set: SparseSet<number>;

  beforeEach(() => {
    set = new SparseSet<number>();
  });

  test("add and get component", () => {
    set.add(5, 42);
    expect(set.get(5)).toBe(42);
    expect(set.has(5)).toBe(true);
  });

  test("has returns false for missing element", () => {
    expect(set.has(1)).toBe(false);
    expect(set.get(1)).toBeNull();
  });

  test("overwrite existing component", () => {
    set.add(3, 10);
    set.add(3, 20);
    expect(set.get(3)).toBe(20);
    expect(set.has(3)).toBe(true);
  });

  test("remove element", () => {
    set.add(1, 100);
    set.add(2, 200);
    set.add(3, 300);

    set.remove(2);
    expect(set.has(2)).toBe(false);
    expect(set.get(2)).toBeNull();

    expect(set.has(1)).toBe(true);
    expect(set.has(3)).toBe(true);
    expect(set.get(1)).toBe(100);
    expect(set.get(3)).toBe(300);
  });

  test("remove last element", () => {
    set.add(7, 77);
    set.remove(7);
    expect(set.has(7)).toBe(false);
    expect(set.get(7)).toBeNull();
  });

  test("swap-remove maintains correct mapping", () => {
    set.add(10, 100);
    set.add(20, 200);
    set.add(30, 300);

    set.remove(20);

    expect(set.has(10)).toBe(true);
    expect(set.get(10)).toBe(100);

    expect(set.has(30)).toBe(true);
    expect(set.get(30)).toBe(300);

    const denseIds = [10, 30].map((id) => set.get(id));
    expect(denseIds).toEqual([100, 300]);
  });

  test("sparse dynamically grows", () => {
    set.add(50, 500);
    expect(set.has(50)).toBe(true);
    expect(set.get(50)).toBe(500);
  });

  test("removing non-existent element does not crash", () => {
    set.add(1, 10);
    expect(() => set.remove(99)).not.toThrow();
  });

  test("adding multiple elements and removing all", () => {
    for (let i = 0; i < 5; i++) {
      set.add(i, i * 10);
    }
    for (let i = 0; i < 5; i++) {
      expect(set.has(i)).toBe(true);
    }

    for (let i = 0; i < 5; i++) {
      set.remove(i);
      expect(set.has(i)).toBe(false);
      expect(set.get(i)).toBeNull();
    }
  });

  test("iterator yields entries in dense order", () => {
    const set = new SparseSet<number>();

    set.add(2, 10);
    set.add(3, 15);
    set.add(4, 20);
    set.add(5, 15);

    const entries = [...set];

    expect(entries).toEqual([
      { id: 2, value: 10 },
      { id: 3, value: 15 },
      { id: 4, value: 20 },
      { id: 5, value: 15 },
    ]);
  });

  test("iterator respects swaps after removal", () => {
    const set = new SparseSet<number>();

    set.add(2, 10);
    set.add(3, 15);
    set.add(4, 20);

    set.remove(3);

    const entries = [...set];

    expect(entries).toEqual([
      { id: 2, value: 10 },
      { id: 4, value: 20 },
    ]);
  });

  test("size returns correct number of elements", () => {
    expect(set.size).toBe(0);

    set.add(1, 10);
    set.add(2, 20);
    expect(set.size).toBe(2);

    set.remove(1);
    expect(set.size).toBe(1);
  });

  test("clear removes all elements", () => {
    set.add(1, 10);
    set.add(2, 20);
    set.add(3, 30);

    set.clear();

    expect(set.size).toBe(0);
    expect(set.has(1)).toBe(false);
    expect(set.has(2)).toBe(false);
    expect(set.has(3)).toBe(false);
  });

  test("ids() yields ids in dense order", () => {
    set.add(5, 50);
    set.add(7, 70);
    set.add(9, 90);

    const ids = [...set.ids()];
    expect(ids).toEqual([5, 7, 9]);
  });

  test("values() yields values in dense order", () => {
    set.add(5, 50);
    set.add(7, 70);
    set.add(9, 90);

    const values = [...set.values()];
    expect(values).toEqual([50, 70, 90]);
  });

  test("entries() yields [id, value] tuples", () => {
    set.add(5, 50);
    set.add(7, 70);

    expect([...set.entries()]).toEqual([
      [5, 50],
      [7, 70],
    ]);
  });

  test("forEach iterates in dense order", () => {
    set.add(1, 10);
    set.add(2, 20);
    set.add(3, 30);

    const collected: Array<[number, number]> = [];

    set.forEach((value, id) => {
      collected.push([id, value]);
    });

    expect(collected).toEqual([
      [1, 10],
      [2, 20],
      [3, 30],
    ]);
  });

  test("ensure returns existing value", () => {
    set.add(10, 100);

    const v = set.ensure(10, () => 999);

    expect(v).toBe(100);
    expect(set.get(10)).toBe(100);
  });

  test("ensure creates value when missing", () => {
    const v = set.ensure(20, () => 200);

    expect(v).toBe(200);
    expect(set.get(20)).toBe(200);
    expect(set.has(20)).toBe(true);
  });

  test("tryGetIndex returns correct dense index", () => {
    set.add(5, 50);
    set.add(7, 70);

    const idx5 = set.tryGetIndex(5);
    const idx7 = set.tryGetIndex(7);

    expect(idx5).toBe(0);
    expect(idx7).toBe(1);
  });

  test("tryGetIndex returns -1 for missing id", () => {
    expect(set.tryGetIndex(123)).toBe(-1);
  });
});
