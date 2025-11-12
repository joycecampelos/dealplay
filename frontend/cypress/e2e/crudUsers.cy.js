before(() => {
  cy.task("cleanDatabase");
  cy.task("createAdminUser");
});

beforeEach(() => {
  cy.visit("/login");

  cy.get("[testid=login-email-input]").type("admin@example.com");
  cy.get("[testid=login-password-input]").type("AdminPass123!");
  cy.get("[testid=login-submit-btn]").click();

  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  cy.contains("Login realizado com sucesso!").should("be.visible");
});

after(() => {
  cy.task("cleanDatabase");
});

describe("CRUD de Usuários", () => {
  it("Acessa a página com a lista de usuários", () => {
    cy.get("[testid=navbar-users-link]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/users`);

    cy.get("[testid=listlayout-title]").should("have.text", "Usuários");
    cy.get("table").should("be.visible");
    cy.get("[testid=listlayout-row-0]").should("be.visible");
    cy.get("[testid=listlayout-name-cell-0]").should("have.text", "Administrador");
  });

  it("Cria um novo usuário", () => {
    cy.visit("/users");

    cy.get("[testid=listlayout-title]").should("have.text", "Usuários");
    cy.get("[testid=listlayout-add-btn]").should("be.visible").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/users/new`);

    cy.get("[testid=formlayout-title]").should("have.text", "Usuário");
    cy.get("[testid=userform-name-input]").type("Usuário Teste");
    cy.get("[testid=userform-email-input]").type("usuario.teste@example.com");
    cy.get("[testid=userform-username-input]").type("usuarioteste");
    cy.get("[testid=userform-password-input]").type("TestePass123!");
    cy.get("[testid=userform-role-select]").select("Administrador");
    cy.get("[testid=formlayout-submit-btn]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/users`);

    cy.contains("Usuário criado com sucesso!").should("be.visible");
  });

  it("Visualiza os detalhes de um usuário", () => {
    cy.visit("/users");

    cy.get("[testid=listlayout-title]").should("have.text", "Usuários");
    cy.get("[testid=listlayout-name-cell-0]").should("have.text", "Usuário Teste");
    cy.get("[testid=listlayout-row-0]").within(() => {
      cy.get("[testid=actionbuttons-view-btn]").click();
    });

    cy.url().should("include", `${Cypress.config().baseUrl}/users/`);

    cy.get("[testid=detaillayout-title]").should("have.text", "Detalhes do usuário");
    cy.get("[testid=detaillayout-back-btn]").should("be.visible");
    cy.get("[testid=detaillayout-edit-btn]").should("be.visible");
    cy.get("[testid=detaillayout-name-value]").should("have.text", "Usuário Teste");
    cy.get("[testid=detaillayout-email-value]").should("have.text", "usuario.teste@example.com");
    cy.get("[testid=detaillayout-username-value]").should("have.text", "usuarioteste");
    cy.get("[testid=detaillayout-role-value]").should("have.text", "Administrador");
  });

  it("Edita um usuário existente", () => {
    cy.visit("/users");

    cy.get("[testid=listlayout-title]").should("have.text", "Usuários");
    cy.get("[testid=listlayout-name-cell-0]").should("have.text", "Usuário Teste");
    cy.get("[testid=listlayout-row-0]").within(() => {
      cy.get("[testid=actionbuttons-edit-btn]").click();
    });

    cy.url().should("include", `${Cypress.config().baseUrl}/users/`);

    cy.get("[testid=formlayout-title]").should("have.text", "Usuário");
    cy.get("[testid=userform-name-input]").click().wait(500).clear().wait(500).type("Usuário Teste Editado");
    cy.get("[testid=formlayout-submit-btn]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/users`);

    cy.contains("Usuário atualizado com sucesso!").should("be.visible");

    cy.get("[testid=listlayout-name-cell-0]").should("have.text", "Usuário Teste Editado");
  });

  it("Deleta um usuário", () => {
    cy.visit("/users");

    cy.get("[testid=listlayout-title]").should("have.text", "Usuários");
    cy.get("[testid=listlayout-name-cell-0]").should("have.text", "Usuário Teste Editado");
    cy.get("[testid=listlayout-row-0]").within(() => {
      cy.get("[testid=actionbuttons-delete-btn]").click();
    });
    cy.get("[testid=listlayout-name-cell-0]").should("have.text", "Administrador");
  });
});
