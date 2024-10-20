import { login } from "../src/js/api/auth/login";
import { logout } from "../src/js/api/auth/logout";
import { save } from "../src/js/storage/save";
import { remove } from "../src/js/storage/remove";

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn();

jest.mock("../src/js/storage/save", () => ({
  save: jest.fn(),
}));

jest.mock("../src/js/storage/remove", () => ({
  remove: jest.fn(),
}));

describe("Authentication functions", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("login function", () => {
    it("should store the token in localStorage when login is successful", async () => {
      const mockToken = "mockAccessToken";

      // Mock fetch response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: mockToken }),
      });

      // Call the login function
      await login("test@example.com", "password123");

      expect(save).toHaveBeenCalledWith("token", mockToken);
    });

    it("should throw an error when login fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Unauthorized",
      });

      await expect(login("test@example.com", "wrongpassword")).rejects.toThrow(
        "Unauthorized"
      );
    });
  });

  describe("logout function", () => {
    it("Clears the token and profile from localStorage", () => {
      logout();

      expect(remove).toHaveBeenCalledWith("token");
      expect(remove).toHaveBeenCalledWith("profile");
    });
  });
});
