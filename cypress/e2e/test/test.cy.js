const baseUrl = "http://127.0.0.1:5500";
const loginUser = (email, password) => {
  cy.visit(baseUrl);
  cy.get(".text-end .btn-outline-success").click();
  cy.get("#loginEmail").type(email);
  cy.get("#loginPassword").type(password);
  cy.get(".modal-footer .btn-success").contains("Login").click();
};

describe("User Authentication Tests", () => {
  it("Login with valid credentials", () => {
    loginUser("truls@stud.noroff.no", "validPassword");
  });

  it("Login with invalid credentials", () => {
    cy.on("window:alert", (alertText) => {
      expect(alertText).to.equal(
        "Either your username was not found or your password is incorrect"
      );
    });
    loginUser("invalidEmail@stud.noroff.no", "invalidPassword");
  });

  it("Logout after login", () => {
    loginUser("truls@stud.noroff.no", "validPassword");
    cy.get(".text-end .btn-outline-warning").contains("Logout").click();
    cy.window().then((window) => {
      const localStorageLength = window.localStorage.length;
      expect(localStorageLength).to.equal(0);
    });
  });
});
