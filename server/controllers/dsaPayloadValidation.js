const difficulties = new Set(["Easy", "Medium", "Hard"]);
const statuses = new Set(["Not Started", "In Progress", "Solved"]);
const priorities = new Set(["High", "Medium", "Low"]);

const fieldValidators = {
  name: (value) => typeof value === "string" && value.trim().length > 0,
  topic: (value) => typeof value === "string" && value.trim().length > 0,
  difficulty: (value) => difficulties.has(value),
  status: (value) => statuses.has(value),
  priority: (value) => priorities.has(value),
  revisionNeeded: (value) => typeof value === "boolean",
  notes: (value) => value === null || typeof value === "string",
  archived: (value) => typeof value === "boolean",
};

const requiredCreateFields = [
  "name",
  "topic",
  "difficulty",
  "status",
  "priority",
];

function isPayloadObject(payload) {
  return payload !== null && typeof payload === "object" && !Array.isArray(payload);
}

function isValidDsaPayload(payload, { requireCreateFields = false } = {}) {
  if (!isPayloadObject(payload)) {
    return false;
  }

  if (
    requireCreateFields &&
    requiredCreateFields.some((field) => !Object.hasOwn(payload, field))
  ) {
    return false;
  }

  return Object.entries(fieldValidators).every(([field, validate]) => {
    if (!Object.hasOwn(payload, field)) {
      return true;
    }

    return validate(payload[field]);
  });
}

export function isValidDsaCreatePayload(payload) {
  return isValidDsaPayload(payload, { requireCreateFields: true });
}

export function isValidDsaPatchPayload(payload) {
  return isValidDsaPayload(payload);
}
