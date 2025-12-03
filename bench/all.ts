import { Bench } from 'tinybench';
import { SparseSet } from '../dist';

function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const N = 1_000_000;
const LOOP_FACTOR = 10_000;
const ids = Array.from({ length: N }, (_, i) => i);
const shuffledIds = shuffle(ids.slice());

// Pre-fill sets
const setForGet = new SparseSet<number>();
const setForRemove = new SparseSet<number>();
for (let i = 0; i < N; i++) {
    setForGet.add(ids[i], ids[i]);
    setForRemove.add(ids[i], ids[i]);
}

const setForAdd = new SparseSet<number>();

let addIndex = 0;
let accessIndex = 0;
let removeIndex = 0;

const bench = new Bench({ name: 'SparseSet per-method benchmark', time: 1000 });

bench
    .add(`add() (x${LOOP_FACTOR})`, () => {
        for (let k = 0; k < LOOP_FACTOR; k++) {
            setForAdd.add(addIndex, addIndex);
            addIndex++;
        }
    })
    .add(`has() (x${LOOP_FACTOR})`, () => {
        for (let k = 0; k < LOOP_FACTOR; k++) {
            setForGet.has(shuffledIds[accessIndex % N]);
            accessIndex++;
        }
    })
    .add(`get() (x${LOOP_FACTOR})`, () => {
        for (let k = 0; k < LOOP_FACTOR; k++) {
            setForGet.get(shuffledIds[accessIndex % N]);
            accessIndex++;
        }
    })
    .add(`remove() (x${LOOP_FACTOR})`, () => {
        for (let k = 0; k < LOOP_FACTOR; k++) {
            const id = shuffledIds[removeIndex % N];
            setForRemove.remove(id);
            setForRemove.add(id, id);
            removeIndex++;
        }
    })
    .add(`size() (x${LOOP_FACTOR})`, () => {
        for (let k = 0; k < LOOP_FACTOR; k++) {
            setForGet.size;
        }
    })
    .add('clear() (on 1000 elements)', () => {
        const tmp = new SparseSet<number>();
        for (let i = 0; i < 1000; i++) tmp.add(i, i);
        tmp.clear();
    })
    .add('iterator()', () => {
        let sum = 0;
        for (const e of setForGet) sum += e.value;
        if (sum === 0) console.log(sum);
    })
    .add('ids()', () => {
        let sum = 0;
        for (const id of setForGet.ids()) sum += id;
        if (sum === 0) console.log(sum);
    })
    .add('values()', () => {
        let sum = 0;
        for (const v of setForGet.values()) sum += v;
        if (sum === 0) console.log(sum);
    })
    .add('entries()', () => {
        let sum = 0;
        for (const [id, v] of setForGet.entries()) sum += v + id;
        if (sum === 0) console.log(sum);
    })
    .add('forEach()', () => {
        let sum = 0;
        setForGet.forEach((v, id) => (sum += v + id));
        if (sum === 0) console.log(sum);
    })
    .add(`ensure() (x${LOOP_FACTOR})`, () => {
        for (let k = 0; k < LOOP_FACTOR; k++) {
            setForGet.ensure(N + accessIndex, () => 999);
            accessIndex++;
        }
    })
    .add(`tryGetIndex() (x${LOOP_FACTOR})`, () => {
        for (let k = 0; k < LOOP_FACTOR; k++) {
            setForGet.tryGetIndex(shuffledIds[accessIndex % N]);
            accessIndex++;
        }
    });

await bench.run();

console.table(bench.table());