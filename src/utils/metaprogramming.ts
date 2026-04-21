

//
// Useful to declare an enum from a const object where each value associated to a key is a possible value
//
// Example:
//
// const STATE = {
//     A: 0,
//     B: 1,
//     C: 2,
// } as const
//
// type State = UnionFromValuesOf<typeof STATE>; // 0|1|2
//
export type UnionFromValuesOf<T> = T[keyof T];