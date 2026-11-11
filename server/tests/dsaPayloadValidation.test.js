import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isValidDsaCreatePayload,
  isValidDsaPatchPayload,
} from "../controllers/dsaPayloadValidation.js";

const validCreatePayload = {
  name: "Two Sum",
  topic: "Array",
  difficulty: "Easy",
  status: "Not Started",
  priority: "Medium",
};

test("DSA create payload requires valid fields and supported enum values", () => {
  assert.equal(isValidDsaCreatePayload(validCreatePayload), true);
  const missingTopic = { ...validCreatePayload };
  delete missingTopic.topic;
  assert.equal(isValidDsaCreatePayload(missingTopic), false);
  assert.equal(
    isValidDsaCreatePayload({ ...validCreatePayload, name: "  " }),
    false,
  );
  assert.equal(
    isValidDsaCreatePayload({ ...validCreatePayload, difficulty: "Expert" }),
    false,
  );
  assert.equal(
    isValidDsaCreatePayload({ ...validCreatePayload, status: null }),
    false,
  );
  assert.equal(
    isValidDsaCreatePayload({ ...validCreatePayload, priority: 1 }),
    false,
  );
  assert.equal(
    isValidDsaCreatePayload({ ...validCreatePayload, topic: undefined }),
    false,
  );
});

test("DSA patch payload validates provided fields and preserves partial semantics", () => {
  assert.equal(isValidDsaPatchPayload({}), true);
  assert.equal(isValidDsaPatchPayload({ status: "Solved" }), true);
  assert.equal(isValidDsaPatchPayload({ notes: null }), true);
  assert.equal(isValidDsaPatchPayload({ notes: 1 }), false);
  assert.equal(isValidDsaPatchPayload({ revisionNeeded: "true" }), false);
  assert.equal(isValidDsaPatchPayload({ archived: null }), false);
  assert.equal(isValidDsaPatchPayload(null), false);
});
