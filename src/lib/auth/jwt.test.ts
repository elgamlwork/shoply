// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { signToken, verifyToken } from "./jwt";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-must-be-at-least-32-bytes-1234567890";
});

describe("signToken / verifyToken", () => {
  it("round-trips the claims", async () => {
    const token = await signToken({
      sub: "u_1",
      username: "ada",
      email: "ada@example.com",
      firstName: "Ada",
      lastName: "Lovelace",
      provider: "local",
    });
    const payload = await verifyToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe("u_1");
    expect(payload?.username).toBe("ada");
    expect(payload?.email).toBe("ada@example.com");
    expect(payload?.firstName).toBe("Ada");
    expect(payload?.lastName).toBe("Lovelace");
    expect(payload?.provider).toBe("local");
  });

  it("returns null for a tampered token", async () => {
    const token = await signToken({
      sub: "u_2",
      username: "grace",
      email: "grace@example.com",
      provider: "dummyjson",
    });
    const tampered = token.slice(0, -2) + (token.endsWith("a") ? "b" : "a");
    const payload = await verifyToken(tampered);
    expect(payload).toBeNull();
  });

  it("returns null for an invalid string", async () => {
    expect(await verifyToken("not-a-jwt")).toBeNull();
    expect(await verifyToken("")).toBeNull();
  });
});
