type Input = [string, string][]

export function parse(raw: string): Input {
    return raw.split('\n').map(line => line.split('-') as [string, string])
}

export function partOne(input: Input) {
    const lookup: Record<string, Node> = {}
    const nodes = new Set<Node>()
    for (let [a, b] of input) {
        if (!lookup[a]) lookup[a] = new Node(a)
        if (!lookup[b]) lookup[b] = new Node(b)
        lookup[a].link(lookup[b])
        lookup[b].link(lookup[a])
        nodes.add(lookup[a])
        nodes.add(lookup[b])
    }

    const threeConnectedNodes = Array.from(nodes)
        .flatMap(node => node.scanForLoop(0, 3))

    const uniqueNetworks: Set<string>[] = []
    for (let set of threeConnectedNodes) {
        if (uniqueNetworks.every(other => set.difference(other).size > 0)) {
            uniqueNetworks.push(set)
        }
    }

    return uniqueNetworks
        .map(set => Array.from(set).toSorted())
        .toSorted()
        .filter(set => set.some(node => node.startsWith('t'))).length
}

export function partTwo(input: Input) {
    const all = new Set()
    for (let [a, b] of input) {
        all.add(a);
        all.add(b)
    }

    return all.size
}

class Node {
    private readonly links: Node[] = []

    constructor(readonly id: string) {
    }

    link(other: Node) {
        this.links.push(other)
    }

    scanForLoop(depth: number, maxDepth: number, target: Node = this): Set<string>[] {
        if (depth > maxDepth) return []
        if (this === target && depth === maxDepth) return [new Set([this.id])]

        const next = this.links
            .flatMap(other => other.scanForLoop(depth + 1, maxDepth, target))
            .filter(set => set != null)

        next.forEach(sets => sets?.add(this.id))

        return next
    }
}