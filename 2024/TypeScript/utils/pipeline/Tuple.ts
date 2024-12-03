export const Tuple = {
    first: <T, U>(tuple: [T, U]): T => tuple[0],
    second: <T, U>(tuple: [T, U]): U => tuple[1],
}