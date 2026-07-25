# C22 site constraints

Source: root `STUDENTS.md`, read before implementation.

## Protected simulator contract

- keep `#registration-form` with `action="api/submit.php"`;
- keep fields `name`, `phone`, `email`;
- keep `<script src="api/visit.php">`;
- keep `.btn-register`, `.pricing-section`, `.program-module`,
  `.program-list`;
- do not change `api/**` or `sql/schema.sql`.

## Permitted C22 surface

`STUDENTS.md` permits visual styling and layout inside sections. C22 uses only
CSS counters on existing programme headings. It does not delete or rename
protected nodes, does not change conversion logic, and does not create
simulator-specific behavior.
