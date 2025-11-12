before(() => {
  cy.task("cleanDatabase");
  cy.task("createAdminUser");
});

after(() => {
  cy.task("cleanDatabase");
});

describe("Login", () => {
  it("Permite login com credenciais válidas", () => {
    cy.visit("/login");

    cy.get("[testid=login-email-input]").type("admin@example.com");
    cy.get("[testid=login-password-input]").type("AdminPass123!");
    cy.get("[testid=login-submit-btn]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.contains("Login realizado com sucesso!").should("be.visible");

    cy.wait(5000);

    cy.get("[testid=navbar-user-menu]").click();
    cy.get("[testid=navbar-logout-btn]").should("be.visible");
    cy.get("[testid=navbar-logout-btn]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
  });

  it("Exibe erro com credenciais inválidas", () => {
    cy.visit("/login");

    cy.get("[testid=login-email-input]").type("admin@example.com");
    cy.get("[testid=login-password-input]").type("SenhaErrada");
    cy.get("[testid=login-submit-btn]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
    cy.contains("E-mail ou senha incorretos.").should("be.visible");
  });

  it("Permite login com Google", () => {
    cy.visit("/login");

    cy.get("[testid=login-google-btn]").should("be.visible");
  });

  describe("Links de navegação", () => {
    it("Redireciona para a página de registro ao clicar no link", () => {
      cy.visit("/login");

      cy.get("[testid=login-register-link]").click();

      cy.url().should("eq", `${Cypress.config().baseUrl}/register`);
    });

    it("Exibe o link de criar conta no AuthLayout", () => {
      cy.visit("/login");

      cy.get("[testid=authlayout-action-link]").should("have.text", "Criar conta");
      cy.get("[testid=authlayout-action-link]").click();

      cy.url().should("eq", `${Cypress.config().baseUrl}/register`);
    });
  });
});
