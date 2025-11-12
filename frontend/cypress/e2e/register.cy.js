before(() => {
  cy.task("cleanDatabase");
});

after(() => {
  cy.task("cleanDatabase");
});

describe("Criar conta", () => {
  it("Permite criar conta com dados válidos", () => {
    cy.visit("/register");

    cy.get("[testid=register-name-input]").type("Usuário Teste");
    cy.get("[testid=register-username-input]").type("usuarioteste");
    cy.get("[testid=register-email-input]").type("usuarioteste@example.com");
    cy.get("[testid=register-password-input]").type("Senha@1234");
    cy.get("[testid=register-submit-btn]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
    cy.contains("Conta criada com sucesso! Você já pode fazer login.").should("be.visible");
  });

  describe("Dados inválidos", () => {
    it("Exibe erro ao tentar criar conta com senha curta", () => {
      cy.visit("/register");

      cy.get("[testid=register-name-input]").type("Usuário Teste");
      cy.get("[testid=register-username-input]").type("usuarioteste");
      cy.get("[testid=register-email-input]").type("usuarioteste@example.com");
      cy.get("[testid=register-password-input]").type("123");
      cy.get("[testid=register-submit-btn]").click();

      cy.url().should("eq", `${Cypress.config().baseUrl}/register`);
      cy.contains("A senha deve ter no mínimo 8 caracteres.").should("be.visible");
    });

    it("Exibe erro ao tentar criar conta com senha fraca", () => {
      cy.visit("/register");

      cy.get("[testid=register-name-input]").type("Usuário Teste");
      cy.get("[testid=register-username-input]").type("usuarioteste");
      cy.get("[testid=register-email-input]").type("usuarioteste@example.com");
      cy.get("[testid=register-password-input]").type("senhaFraca");
      cy.get("[testid=register-submit-btn]").click();

      cy.url().should("eq", `${Cypress.config().baseUrl}/register`);
      cy.contains("A senha deve conter pelo menos uma letra maiúscula, um número e um símbolo.").should("be.visible");
    });

    it("Exibe erro ao tentar criar conta com e-mail já registrado", () => {
      cy.visit("/register");

      cy.get("[testid=register-name-input]").type("Usuário Teste");
      cy.get("[testid=register-username-input]").type("usuarioteste");
      cy.get("[testid=register-email-input]").type("usuarioteste@example.com");
      cy.get("[testid=register-password-input]").type("Senha@1234");
      cy.get("[testid=register-submit-btn]").click();

      cy.url().should("eq", `${Cypress.config().baseUrl}/register`);
      cy.contains("Este e-mail já está cadastrado.").should("be.visible");
    });

    it("Exibe erro ao tentar criar conta com nome de usuário já em uso", () => {
      cy.visit("/register");

      cy.get("[testid=register-name-input]").type("Usuário Teste2");
      cy.get("[testid=register-username-input]").type("usuarioteste");
      cy.get("[testid=register-email-input]").type("usuarioteste2@example.com");
      cy.get("[testid=register-password-input]").type("Senha@1234");
      cy.get("[testid=register-submit-btn]").click();

      cy.url().should("eq", `${Cypress.config().baseUrl}/register`);
      cy.contains("Este nome de usuário já está em uso.").should("be.visible");
    });
  });

  describe("Links de navegação", () => {
    it("Redireciona para a página de login ao clicar no link", () => {
      cy.visit("/register");

      cy.get("[testid=register-login-link]").click();

      cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
    });

    it("Exibe o link de entrar no AuthLayout", () => {
      cy.visit("/register");

      cy.get("[testid=authlayout-action-link]").should("have.text", "Entrar");
      cy.get("[testid=authlayout-action-link]").click();

      cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
    });
  });
});
