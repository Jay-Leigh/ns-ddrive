import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const requiredDocuments = [
  "docs/architecture/NorthStar_Architecture_Decision_Register.md",
  "docs/contracts/NorthStar_API_Contract_Register.md",
  "docs/project/NorthStar_Project_Seed.md",
  "docs/project/NorthStar_Technical_Glossary.md",
] as const;

describe("repository foundation", () => {
  it("keeps the package engine synchronized with the pinned Node version", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
      engines: { node: string };
    };
    const nodeVersion = (await readFile(".node-version", "utf8")).trim();

    expect(packageJson.engines.node).toBe(nodeVersion);
  });

  it.each(requiredDocuments)("includes required document %s", async (path) => {
    await expect(readFile(path, "utf8")).resolves.not.toHaveLength(0);
  });
});
