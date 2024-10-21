import { login } from "../src/js/api/auth/login";
import { logout } from "../src/js/api/auth/logout";
import { save } from "../src/js/storage/save";
import { remove } from "../src/js/storage/remove";

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.fetch = jest.fn();

jest.mock("../src/js/storage/save", () => ({
  save: jest.fn(),
}));

jest.mock("../src/js/storage/remove", () => ({
  remove: jest.fn(),
}));

describe("Authentication Tests", () => {
  const mockToken = "mockAccessToken";

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("login functionality", () => {
    it("saves token to localStorage on successful login", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: mockToken }),
      });
      await login("test@example.com", "password123");
      expect(save).toHaveBeenCalledWith("token", mockToken);
    });

    it("throws error when login fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Unauthorized",
      });
      await expect(login("test@example.com", "wrongpassword")).rejects.toThrow(
        "Unauthorized"
      );
    });
  });

  describe("logout functionality", () => {
    it("removes token and profile from localStorage", () => {
      logout();
      expect(remove).toHaveBeenCalledWith("token");
      expect(remove).toHaveBeenCalledWith("profile");
    });
  });
});
