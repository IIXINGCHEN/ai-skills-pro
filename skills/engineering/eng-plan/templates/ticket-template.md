# Ticket: NNN-<slug>

One complete user-facing capability cutting through every layer it touches
(frontend, backend, data, tests, acceptance). Never a horizontal task
("all the backend", "all the tests").

Prefer a thin end-to-end tracer bullet grown in later tickets over a complete
layer finished early. Ticket 1 delivers the simplest version that works end
to end; convenience arrives in later tickets pulled by real need. Any
abstraction the plan introduces names the second concrete ticket that uses
it; an abstraction with a single consumer is deferred until a second case
exists.

## Blocking edges

<IDs of tickets this ticket waits on. Empty when independent - independent
slices run in parallel.>

## Implementation steps

| ACTION | TARGET | OBJECTIVE | PATTERN REFERENCE | VALIDATION |
|---|---|---|---|---|
| CREATE \| UPDATE \| REMOVE | <file path> | <mapped to acceptance criteria> | <existing file:line> | <executable command> |

## Acceptance criteria

- [ ] ...
