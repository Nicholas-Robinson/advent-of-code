# TypeScript Solution

This is my TypeScript solution for the 2024 Advent of Code. To run this solution
you need to:

## Install Deno

```bash
curl -fsSL https://deno.land/install.sh | sh
```

## Run the solution

```bash
deno task solve --day=<day> [--part=<part>]
```

### Where

- `<day>` is the day you want to run
- `<part>` is the part of the day you want to run.
  - If you don't specify the part, it will run both parts.

## Developing

If you want to have a go at developing or changing the solution, you can run

```bash
deno task dev --day=<day> [--part=<part>]
```

This will run the solution and watch for changes in the files. If you change the
solution, it will automatically run the solution again.

**Note**:

The `_template` folder contains the template for the solution. If you want to
create a new day, you can copy the `_template` folder and rename it to the day
you want to create. Then you can start developing the solution.
