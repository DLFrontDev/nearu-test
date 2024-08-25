// sum.test.js
import { expect, test } from "vitest";
import { convertDate } from "@/utils/convertDate";

test("Converts date format from string", () => {
  expect(convertDate("2000-01-02")).toMatchSnapshot();
});

test("Converts date format from null", () => {
  expect(convertDate(null)).toBe(null);
});
