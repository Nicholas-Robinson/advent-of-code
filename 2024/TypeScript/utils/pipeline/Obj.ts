export const Obj = {
  entries: <K extends keyof any, V>(obj: Record<K, V>) =>
    Object.entries(obj) as [K, V][],
  fromEntries: <K extends keyof any, V>(entries: [K, V][]) =>
    Object.fromEntries(entries) as Record<K, V>,

  mapKeys: <K extends keyof any, V>(fn: (key: K) => K) => (obj: Record<K, V>) =>
    Obj.fromEntries(Obj.entries(obj).map(([k, v]) => [fn(k), v])),

  mapValues:
    <K extends keyof any, V, V2>(fn: (value: V) => V2) =>
    (obj: Record<K, V>) =>
      Obj.fromEntries(Obj.entries(obj).map(([k, v]) => [k, fn(v)])),
};