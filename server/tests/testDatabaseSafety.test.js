import assert from "node:assert/strict";
import { test } from "node:test";
import { isDedicatedTestDatabaseUrl } from "./testDatabaseSafety.js";

test("test database guard requires a local PostgreSQL database with a test name", () => {
  assert.equal(
    isDedicatedTestDatabaseUrl("postgresql://localhost:5432/careeros_test"),
    true,
  );
  assert.equal(
    isDedicatedTestDatabaseUrl("postgresql://db.example.com:5432/careeros_test"),
    false,
  );
  assert.equal(
    isDedicatedTestDatabaseUrl("postgresql://127.0.0.1:5432/careeros"),
    false,
  );
  assert.equal(
    isDedicatedTestDatabaseUrl("mysql://localhost:3306/careeros_test"),
    false,
  );
});
