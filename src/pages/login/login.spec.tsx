import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "./login";

describe("Login  Page", () => {
  it("should render with required fields", () => {
    //arrange,assert,act
    render(<LoginPage />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Remember me" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Forgot password" }),
    ).toBeInTheDocument();
  });
});
