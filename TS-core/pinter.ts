export class Printer {
    private readonly tasks: PintTask<any>[]

    constructor(...tasks: PintTask<any>[]) {
        for (let task of tasks) task.bindPrinter(this)
        this.tasks = tasks;
    }

    print() {
        console.clear()

        const groups = this.tasks.map(task => task.render())
        for (let group of groups) {
            for (let line of group) console.log(line)
            console.log()
        }
    }
}

abstract class PintTask<T> {
    protected printer!: Printer
    protected current?: T;

    public bindPrinter(printer: Printer) {
        this.printer = printer
    }

    public accept(data: T) {
        this.current = data;
        this.update(data)
        this.printer.print()
    }

    public abstract render(): string[];

    public abstract reset(): void;

    protected abstract update(data: T): void;
}

class ResultsPintTaskPayload {
    public status: 'running' | 'complete' | 'failed' = 'running'
    public label: string = 'Input'
    public timeTaken: string | undefined = undefined
    public result: string | undefined = undefined
    public trace: Error | undefined = undefined

    constructor(private readonly printer: Printer) {}

    set(overrides: Partial<ResultsPintTaskPayload>) {
        this.status = overrides.status ?? this.status
        this.label = overrides.label ?? this.label
        this.timeTaken = overrides.timeTaken ?? this.timeTaken
        this.result = overrides.result ?? this.result
        this.trace = overrides.trace ?? this.trace

        this.printer.print()
    }
}

export class ResultsPrintTask extends PintTask<ResultsPintTaskPayload[]> {

    render(): string[] {
        return this.current?.flatMap(payload => this.renderOne(payload)) ?? [];
    }

    renderOne(payload: ResultsPintTaskPayload) {
        switch (payload.status) {
            case 'running':
                return [`${payload.label} :: Running...`]
            case 'failed': {
                return [
                    `${payload.label} :: Failed`,
                    ...(payload.trace?.stack?.split('\n') ?? [])
                ]
            }
            case 'complete': {
                return [`${payload.label} (${payload.timeTaken}) :: ${payload.result}`,]
            }
        }
    }

    reset(): void {
        this.current = []
    }

    protected update(data: ResultsPintTaskPayload[]): void {
        // Nothing to do here
    }

    make() {
        const payload = new ResultsPintTaskPayload(this.printer)
        this.accept([...this.current ?? [], payload])
        return payload
    }
}

type LoadedEnvPrintTaskPayload = {
    day: string; year: string; part: number;
    hasParser: boolean; hasSolution: boolean; loadedInput: string | undefined;
}

export class LoadedEnvPrintTask extends PintTask<LoadedEnvPrintTaskPayload> {
    render(): string[] {
        const suffix = ['', 'One', 'Two'][this.current?.part ?? 0];

        return [
            `🚀 Running :: Day ${this.current?.day}, ${this.current?.year} | Part ${this.current?.part}`,
            [
                this.current?.hasParser ? `✅  Found parser` : `⚠️  Could not find a parser called: parse or parsePart${suffix}`,
                this.current?.hasSolution ? `✅  Loaded solution: part${suffix}` : `⚠️  Could not find a solution called: part${suffix}`,
                this.current?.loadedInput ? `✅  Running input: ${this.current.loadedInput}` : `⚠️  No input.txt or input.part${this.current?.part}.txt found`,
            ].join('  ')
        ];
    }

    reset(): void {
    }

    protected update(data: LoadedEnvPrintTaskPayload): void {
    }
}

export class InstructionsPrintTask extends PintTask<{ part: number }> {
    render(): string[] {
        return [
            `Available commands`,
            `• init          => Initialise the day's solution`,
            `• toggle        => Activate part ${this.current?.part === 1 ? 2 : 1}`,
            `• run           => Run solution`,
            `• part [number] => Set the active part`,
            `• day  [number] => Set the active day`,
            `• year [number] => Set the active year`,
        ];
    }

    reset(): void {
    }

    protected update(data: { part: number }): void {
    }

}