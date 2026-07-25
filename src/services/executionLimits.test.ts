import { JavaScriptService } from "./javascript/JavaScriptService";
import { PyodideService } from "./pyodide/PyodideService";

describe("execution safety limits", () => {
  it("rejects oversized Python source before creating a Worker", async () => {
    const service = new PyodideService();
    const result = await service.run("x".repeat(100_001), "");
    expect(result.status).toBe("error");
    expect(result.stderr).toMatch(/100,000-character safety limit/i);
  });

  it("rejects oversized JavaScript input before creating a Worker", async () => {
    const service = new JavaScriptService();
    const result = await service.run("", "x".repeat(20_001));
    expect(result.status).toBe("error");
    expect(result.stderr).toMatch(/20,000-character safety limit/i);
  });
});
