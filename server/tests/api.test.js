import "dotenv/config";
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
    'TRUNCATE TABLE "DSAProblem", "Company", "Project", "InterviewEntry", "User" RESTART IDENTITY CASCADE',
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

  // ─── Partial update tests ────────────────────────────────────────────────────

  await t.test("DSA partial update: single field leaves other fields unchanged", async () => {
    const createRes = await request("/dsa", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Merge Intervals",
        topic: "Array",
        difficulty: "Medium",
        status: "Not Started",
        priority: "High",
        revisionNeeded: false,
        notes: "original notes",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).problem;

    // Patch only status — all other fields must stay as created.
    const patchRes = await request(`/dsa/${created.id}`, {
      method: "PATCH",
      token: firstToken,
      body: { status: "Solved" },
    });
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.status, "Solved");
    assert.equal(patched.name, "Merge Intervals", "name must be unchanged");
    assert.equal(patched.topic, "Array", "topic must be unchanged");
    assert.equal(patched.difficulty, "Medium", "difficulty must be unchanged");
    assert.equal(patched.priority, "High", "priority must be unchanged");
    assert.equal(patched.revisionNeeded, false, "revisionNeeded must be unchanged");
    assert.equal(patched.notes, "original notes", "notes must be unchanged");

    // Patch only revisionNeeded — status must stay "Solved".
    const patchRes2 = await request(`/dsa/${created.id}`, {
      method: "PATCH",
      token: firstToken,
      body: { revisionNeeded: true },
    });
    assert.equal(patchRes2.status, 200);
    const patched2 = await patchRes2.json();
    assert.equal(patched2.revisionNeeded, true);
    assert.equal(patched2.status, "Solved", "status must still be Solved");
    assert.equal(patched2.name, "Merge Intervals", "name must be unchanged");

    // Cleanup
    await request(`/dsa/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("DSA partial update: multiple fields updated together", async () => {
    const createRes = await request("/dsa", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Valid Parentheses",
        topic: "Stack",
        difficulty: "Easy",
        status: "Not Started",
        priority: "Low",
        revisionNeeded: false,
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).problem;

    const patchRes = await request(`/dsa/${created.id}`, {
      method: "PATCH",
      token: firstToken,
      body: { status: "In Progress", priority: "High", archived: true },
    });
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.status, "In Progress");
    assert.equal(patched.priority, "High");
    assert.equal(patched.archived, true);
    assert.equal(patched.name, "Valid Parentheses", "name must be unchanged");
    assert.equal(patched.topic, "Stack", "topic must be unchanged");
    assert.equal(patched.difficulty, "Easy", "difficulty must be unchanged");

    // Cleanup
    await request(`/dsa/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("DSA partial update: explicit null clears nullable notes field", async () => {
    const createRes = await request("/dsa", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Binary Search",
        topic: "Binary Search",
        difficulty: "Easy",
        status: "Solved",
        priority: "Medium",
        notes: "some notes to clear",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).problem;
    assert.equal(created.notes, "some notes to clear");

    // Explicit null should clear the nullable field.
    const patchRes = await request(`/dsa/${created.id}`, {
      method: "PATCH",
      token: firstToken,
      body: { notes: null },
    });
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.notes, null, "notes should be cleared to null");
    assert.equal(patched.name, "Binary Search", "name must be unchanged");

    // Cleanup
    await request(`/dsa/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("DSA partial update: cross-user patch is blocked", async () => {
    const createRes = await request("/dsa", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Climbing Stairs",
        topic: "DP",
        difficulty: "Easy",
        status: "Not Started",
        priority: "Low",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).problem;

    // secondUser must not be able to update firstUser's record.
    const forbiddenPatch = await request(`/dsa/${created.id}`, {
      method: "PATCH",
      token: secondToken,
      body: { status: "Solved" },
    });
    assert.equal(forbiddenPatch.status, 404);

    // Verify the record was not modified.
    const verifyRes = await request(`/dsa/${created.id}`, { token: firstToken });
    assert.equal(verifyRes.status, 200);
    assert.equal((await verifyRes.json()).status, "Not Started");

    // Cleanup
    await request(`/dsa/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("DSA partial update: non-existent record returns 404", async () => {
    const res = await request("/dsa/999999999", {
      method: "PATCH",
      token: firstToken,
      body: { status: "Solved" },
    });
    assert.equal(res.status, 404);
  });

  await t.test("Company partial update: single field leaves other fields unchanged", async () => {
    const createRes = await request("/companies", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Acme Corp",
        role: "Backend Engineer",
        status: "Applied",
        applicationDate: "2026-11-01",
        priority: "Medium",
        notes: "original company notes",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).company;

    // Patch only status.
    const patchRes = await request(`/companies/${created.id}`, {
      method: "PATCH",
      token: firstToken,
      body: { status: "Interviewing" },
    });
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.status, "Interviewing");
    assert.equal(patched.name, "Acme Corp", "name must be unchanged");
    assert.equal(patched.role, "Backend Engineer", "role must be unchanged");
    assert.equal(patched.applicationDate, "2026-11-01", "applicationDate must be unchanged");
    assert.equal(patched.priority, "Medium", "priority must be unchanged");
    assert.equal(patched.notes, "original company notes", "notes must be unchanged");

    // Cleanup
    await request(`/companies/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("Company partial update: explicit null clears nullable applicationDate", async () => {
    const createRes = await request("/companies", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Nullcorp",
        role: "SWE",
        status: "Applied",
        applicationDate: "2026-10-15",
        priority: "Low",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).company;
    assert.equal(created.applicationDate, "2026-10-15");

    // Explicit null should clear the nullable applicationDate field.
    const patchRes = await request(`/companies/${created.id}`, {
      method: "PATCH",
      token: firstToken,
      body: { applicationDate: null },
    });
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.applicationDate, null, "applicationDate should be cleared to null");
    assert.equal(patched.name, "Nullcorp", "name must be unchanged");
    assert.equal(patched.role, "SWE", "role must be unchanged");

    // Cleanup
    await request(`/companies/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("Company partial update: cross-user patch is blocked", async () => {
    const createRes = await request("/companies", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Secret Corp",
        role: "DevOps",
        status: "Applied",
        priority: "High",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).company;

    const forbiddenPatch = await request(`/companies/${created.id}`, {
      method: "PATCH",
      token: secondToken,
      body: { status: "Offer" },
    });
    assert.equal(forbiddenPatch.status, 404);

    // Verify the record was not modified.
    const verifyRes = await request(`/companies/${created.id}`, { token: firstToken });
    assert.equal(verifyRes.status, 200);
    assert.equal((await verifyRes.json()).status, "Applied");

    // Cleanup
    await request(`/companies/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("Company partial update: non-existent record returns 404", async () => {
    const res = await request("/companies/999999999", {
      method: "PATCH",
      token: firstToken,
      body: { status: "Offer" },
    });
    assert.equal(res.status, 404);
  });

  await t.test("Project partial update: single field leaves other fields unchanged", async () => {
    const createRes = await request("/projects", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Distributed Cache",
        techStack: "Go, Redis",
        progress: 40,
        status: "In Progress",
        priority: "High",
        notes: "original project notes",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).project;

    // Patch only progress.
    const patchRes = await request(`/projects/${created.id}`, {
      method: "PATCH",
      token: firstToken,
      body: { progress: 75 },
    });
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.progress, 75);
    assert.equal(patched.name, "Distributed Cache", "name must be unchanged");
    assert.equal(patched.techStack, "Go, Redis", "techStack must be unchanged");
    assert.equal(patched.status, "In Progress", "status must be unchanged");
    assert.equal(patched.priority, "High", "priority must be unchanged");
    assert.equal(patched.notes, "original project notes", "notes must be unchanged");

    // Cleanup
    await request(`/projects/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("Project partial update: multiple fields updated together", async () => {
    const createRes = await request("/projects", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Blog Engine",
        techStack: "React, Node",
        progress: 10,
        status: "Planning",
        priority: "Low",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).project;

    const patchRes = await request(`/projects/${created.id}`, {
      method: "PATCH",
      token: firstToken,
      body: { status: "Completed", progress: 100, priority: "Medium" },
    });
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.status, "Completed");
    assert.equal(patched.progress, 100);
    assert.equal(patched.priority, "Medium");
    assert.equal(patched.name, "Blog Engine", "name must be unchanged");
    assert.equal(patched.techStack, "React, Node", "techStack must be unchanged");

    // Cleanup
    await request(`/projects/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("Project partial update: cross-user patch is blocked", async () => {
    const createRes = await request("/projects", {
      method: "POST",
      token: firstToken,
      body: {
        name: "Secret Project",
        techStack: "Rust",
        progress: 0,
        status: "Planning",
        priority: "High",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).project;

    const forbiddenPatch = await request(`/projects/${created.id}`, {
      method: "PATCH",
      token: secondToken,
      body: { status: "Completed" },
    });
    assert.equal(forbiddenPatch.status, 404);

    // Verify record was not modified.
    const verifyRes = await request(`/projects/${created.id}`, { token: firstToken });
    assert.equal(verifyRes.status, 200);
    assert.equal((await verifyRes.json()).status, "Planning");

    // Cleanup
    await request(`/projects/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("Project partial update: non-existent record returns 404", async () => {
    const res = await request("/projects/999999999", {
      method: "PATCH",
      token: firstToken,
      body: { status: "Completed" },
    });
    assert.equal(res.status, 404);
  });

  await t.test("InterviewEntry partial update: single field leaves other fields unchanged", async () => {
    const createRes = await request("/interviews", {
      method: "POST",
      token: firstToken,
      body: {
        company: "StreamCo",
        round: "Technical",
        questionsAsked: "Explain virtual DOM",
        myAnswer: "It is an in-memory representation",
        mistakes: "forgot to mention reconciliation",
        lessonsLearned: "study reconciliation algorithm",
        priority: "High",
        notes: "original interview notes",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).entry;

    // Patch only priority.
    const patchRes = await request(`/interviews/${created.id}`, {
      method: "PATCH",
      token: firstToken,
      body: { priority: "Low" },
    });
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.priority, "Low");
    assert.equal(patched.company, "StreamCo", "company must be unchanged");
    assert.equal(patched.round, "Technical", "round must be unchanged");
    assert.equal(patched.questionsAsked, "Explain virtual DOM", "questionsAsked must be unchanged");
    assert.equal(patched.myAnswer, "It is an in-memory representation", "myAnswer must be unchanged");
    assert.equal(patched.mistakes, "forgot to mention reconciliation", "mistakes must be unchanged");
    assert.equal(patched.lessonsLearned, "study reconciliation algorithm", "lessonsLearned must be unchanged");
    assert.equal(patched.notes, "original interview notes", "notes must be unchanged");

    // Cleanup
    await request(`/interviews/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("InterviewEntry partial update: explicit null clears nullable notes field", async () => {
    const createRes = await request("/interviews", {
      method: "POST",
      token: firstToken,
      body: {
        company: "ClearCo",
        round: "HR",
        priority: "Low",
        notes: "notes to clear",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).entry;
    assert.equal(created.notes, "notes to clear");

    // Explicit null clears the nullable notes field.
    const patchRes = await request(`/interviews/${created.id}`, {
      method: "PATCH",
      token: firstToken,
      body: { notes: null },
    });
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.notes, null, "notes should be cleared to null");
    assert.equal(patched.company, "ClearCo", "company must be unchanged");
    assert.equal(patched.priority, "Low", "priority must be unchanged");

    // Cleanup
    await request(`/interviews/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("InterviewEntry partial update: cross-user patch is blocked", async () => {
    const createRes = await request("/interviews", {
      method: "POST",
      token: firstToken,
      body: {
        company: "PrivateCo",
        round: "Managerial",
        priority: "Medium",
      },
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()).entry;

    const forbiddenPatch = await request(`/interviews/${created.id}`, {
      method: "PATCH",
      token: secondToken,
      body: { priority: "High" },
    });
    assert.equal(forbiddenPatch.status, 404);

    // Verify record was not modified.
    const verifyRes = await request(`/interviews/${created.id}`, { token: firstToken });
    assert.equal(verifyRes.status, 200);
    assert.equal((await verifyRes.json()).priority, "Medium");

    // Cleanup
    await request(`/interviews/${created.id}`, { method: "DELETE", token: firstToken });
  });

  await t.test("InterviewEntry partial update: non-existent record returns 404", async () => {
    const res = await request("/interviews/999999999", {
      method: "PATCH",
      token: firstToken,
      body: { priority: "High" },
    });
    assert.equal(res.status, 404);
  });

  // ─── End of partial update tests ────────────────────────────────────────────

  const currentUserResponse = await request("/users/me", {
    token: firstToken,
  });
  assert.equal(currentUserResponse.status, 200);
  const currentUser = (await currentUserResponse.json()).user;
  assert.equal(currentUser.email, firstUser.email);
  assert.equal(currentUser.password, undefined);
});
