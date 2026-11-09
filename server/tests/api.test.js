import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import pg from "pg";

const { Pool } = pg;
const serverDirectory = fileURLToPath(new URL("..", import.meta.url));
const port = 3417;
const baseUrl = `http://127.0.0.1:${port}`;
const databaseUrl = process.env.DATABASE_URL;

let serverProcess;
let database;

async function request(path, { method = "GET", token, body } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  return fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

before(async () => {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must point to a migrated test database.");
  }

  database = new Pool({ connectionString: databaseUrl });
  await database.query(
    'TRUNCATE TABLE "DSAProblem", "Company", "User" RESTART IDENTITY CASCADE',
  );

  serverProcess = spawn(process.execPath, ["app.js"], {
    cwd: serverDirectory,
    env: {
      ...process.env,
      PORT: String(port),
      JWT_SECRET: "careeros-integration-test-secret",
      GROQ_API_KEY: "test-key-not-used-by-these-tests",
      CLIENT_ORIGIN: "http://localhost:5173",
    },
    stdio: "ignore",
  });

  let started = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (serverProcess.exitCode !== null) {
      throw new Error(`API server exited with code ${serverProcess.exitCode}`);
    }

    try {
      const response = await fetch(`${baseUrl}/users/me`);
      if (response.status === 401) {
        started = true;
        break;
      }
    } catch {
      // The server may still be starting.
    }

    await delay(250);
  }

  if (!started) {
    serverProcess.kill();
    throw new Error("API server did not become ready within 15 seconds.");
  }
});

after(async () => {
  if (serverProcess && serverProcess.exitCode === null) {
    serverProcess.kill("SIGTERM");
    await Promise.race([once(serverProcess, "exit"), delay(3000)]);
  }

  if (database) {
    await database.end();
  }
});

test("authenticated API routes enforce access control and persist user data", async (t) => {
  const firstUser = {
    name: "Test User One",
    email: "one@example.test",
    password: "test-password-one",
  };
  const secondUser = {
    name: "Test User Two",
    email: "two@example.test",
    password: "test-password-two",
  };

  const firstRegistration = await request("/users/register", {
    method: "POST",
    body: firstUser,
  });
  assert.equal(firstRegistration.status, 201);

  const duplicateRegistration = await request("/users/register", {
    method: "POST",
    body: firstUser,
  });
  assert.equal(duplicateRegistration.status, 400);

  const secondRegistration = await request("/users/register", {
    method: "POST",
    body: secondUser,
  });
  assert.equal(secondRegistration.status, 201);

  const invalidLogin = await request("/users/login", {
    method: "POST",
    body: { email: firstUser.email, password: "wrong-password" },
  });
  assert.equal(invalidLogin.status, 401);

  const firstLogin = await request("/users/login", {
    method: "POST",
    body: { email: firstUser.email, password: firstUser.password },
  });
  assert.equal(firstLogin.status, 200);
  const firstToken = (await firstLogin.json()).token;
  assert.ok(firstToken);

  const secondLogin = await request("/users/login", {
    method: "POST",
    body: { email: secondUser.email, password: secondUser.password },
  });
  assert.equal(secondLogin.status, 200);
  const secondToken = (await secondLogin.json()).token;

  await t.test("rejects unauthenticated access to protected endpoints", async () => {
    const response = await request("/dsa");
    assert.equal(response.status, 401);
  });

  let problemId;

  await t.test("supports DSA CRUD and prevents cross-user access", async () => {
    const createResponse = await request("/dsa", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Two Sum",
        topic: "Array",
        difficulty: "Easy",
        status: "Solved",
        priority: "High",
        revisionNeeded: true,
        notes: "Integration test record",
      },
    });
    assert.equal(createResponse.status, 201);
    const created = (await createResponse.json()).problem;
    problemId = created.id;
    assert.equal(created.userId, 1);

    const listResponse = await request("/dsa", { token: firstToken });
    assert.equal(listResponse.status, 200);
    const problems = await listResponse.json();
    assert.equal(problems.length, 1);
    assert.equal(problems[0].name, "Two Sum");

    const ownRecord = await request(`/dsa/${problemId}`, {
      token: firstToken,
    });
    assert.equal(ownRecord.status, 200);

    const otherUserRecord = await request(`/dsa/${problemId}`, {
      token: secondToken,
    });
    assert.equal(otherUserRecord.status, 404);

    const forbiddenDelete = await request(`/dsa/${problemId}`, {
      method: "DELETE",
      token: secondToken,
    });
    assert.equal(forbiddenDelete.status, 404);

    const updateResponse = await request(`/dsa/${problemId}`, {
      method: "PATCH",
      token: firstToken,
      body: { status: "In Progress", archived: true },
    });
    assert.equal(updateResponse.status, 200);
    const updated = await updateResponse.json();
    assert.equal(updated.status, "In Progress");
    assert.equal(updated.archived, true);

    const deleteResponse = await request(`/dsa/${problemId}`, {
      method: "DELETE",
      token: firstToken,
    });
    assert.equal(deleteResponse.status, 200);

    const missingRecord = await request(`/dsa/${problemId}`, {
      token: firstToken,
    });
    assert.equal(missingRecord.status, 404);
  });

  let companyId;

  await t.test("supports company application CRUD and user isolation", async () => {
    const createResponse = await request("/companies", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Example Payments",
        role: "Software Engineering Intern",
        status: "Applied",
        applicationDate: "2026-11-09",
        priority: "High",
        notes: "Integration test record",
      },
    });
    assert.equal(createResponse.status, 201);
    const created = (await createResponse.json()).company;
    companyId = created.id;
    assert.equal(created.userId, 1);

    const otherUserRecord = await request(`/companies/${companyId}`, {
      token: secondToken,
    });
    assert.equal(otherUserRecord.status, 404);

    const updateResponse = await request(`/companies/${companyId}`, {
      method: "PATCH",
      token: firstToken,
      body: { status: "Interviewing" },
    });
    assert.equal(updateResponse.status, 200);
    assert.equal((await updateResponse.json()).status, "Interviewing");

    const deleteResponse = await request(`/companies/${companyId}`, {
      method: "DELETE",
      token: firstToken,
    });
    assert.equal(deleteResponse.status, 200);
  });

  await t.test("returns analytics for the authenticated user's records", async () => {
    const response = await request("/analytics", { token: firstToken });
    assert.equal(response.status, 200);
    const analytics = await response.json();
    assert.equal(typeof analytics.dsa.solveRate, "number");
    assert.equal(typeof analytics.companies.total, "number");
    assert.ok(Array.isArray(analytics.insights));
    assert.ok(Array.isArray(analytics.recommendations));
  });

  const currentUserResponse = await request("/users/me", {
    token: firstToken,
  });
  assert.equal(currentUserResponse.status, 200);
  const currentUser = (await currentUserResponse.json()).user;
  assert.equal(currentUser.email, firstUser.email);
  assert.equal(currentUser.password, undefined);
});
