import axios from "axios";

describe("GET /api", () => {
  it("should return a message", async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).not.toBeNull();
    expect(res.data.ts).not.toBeUndefined();    
  });
});
