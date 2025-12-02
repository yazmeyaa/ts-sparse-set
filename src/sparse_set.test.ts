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
});
