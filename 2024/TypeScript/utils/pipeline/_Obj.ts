export const _Obj = {
  entries: <K extends keyof any, V>(obj: Record<K, V>) =>
    Object.entries(obj) as [K, V][],

  keys: <K extends keyof any>(obj: Record<K, any>) => Object.keys(obj) as K[],

  values: <V>(obj: Record<any, V>) => Object.values(obj) as V[],

  isEmpty: <K extends keyof any, V>(obj: Record<K, V>) => _Obj.keys(obj).length === 0,

  fromEntries: <K extends keyof any, V>(entries: [K, V][]) =>
    Object.fromEntries(entries) as Record<K, V>,

  mapKeys: <K extends keyof any, V>(fn: (key: K) => K) => (obj: Record<K, V>) =>
    _Obj.fromEntries(_Obj.entries(obj).map(([k, v]) => [fn(k), v])),

  mapValues:
    <K extends keyof any, V, V2>(fn: (value: V) => V2) => (obj: Record<K, V>) =>
      _Obj.fromEntries(_Obj.entries(obj).map(([k, v]) => [k, fn(v)])),
};
