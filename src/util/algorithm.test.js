import { shuffleArray } from "./algorithm";

test("that shuffle does not return same array", () => {
    let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    shuffleArray(a);
    expect(a).not.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("that shuffle maintains array length", () => {
    let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    shuffleArray(a);
    expect(a.length).toEqual(10);
})
