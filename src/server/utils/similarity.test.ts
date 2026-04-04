import { cosineSimilarity } from "./similarity";
import { describe, test, expect } from "@jest/globals";

describe("cosineSimilarity", () => {
  test("identical vectors should return 1", () => {
    const A = [1, 2, 3];
    const B = [1, 2, 3];

    const result = cosineSimilarity(A, B);

    expect(result).toBeCloseTo(1);
  });

  test("orthogonal vectors should return 0", () => {
    const A = [1, 0];
    const B = [0, 1];

    const result = cosineSimilarity(A, B);

    expect(result).toBeCloseTo(0);
  });

  test("opposite vectors should return -1", () => {
    const A = [1, 0];
    const B = [-1, 0];

    const result = cosineSimilarity(A, B);

    expect(result).toBeCloseTo(-1);
  });

  test("similar vectors should return high similarity", () => {
    const A = [1, 1];
    const B = [2, 2];

    const result = cosineSimilarity(A, B);

    expect(result).toBeCloseTo(1);
  });

  test("different vectors should return low similarity", () => {
    const A = [1, 2, 3];
    const B = [4, 5, 6];

    const result = cosineSimilarity(A, B);

    expect(result).toBeGreaterThan(0.9);
  });

  test("should throw error for different vector lengths", () => {
    const A = [1, 2];
    const B = [1, 2, 3];

    expect(() => cosineSimilarity(A, B)).toThrow();
  });

  test("zero vector should return 0", () => {
    const A = [0, 0, 0];
    const B = [1, 2, 3];

    const result = cosineSimilarity(A, B);

    expect(result).toBe(0);
  });
});
