before(() => {
  cy.task("cleanDatabase");
  cy.task("createAdminUser");
  cy.task("createAnyUser");
  cy.task("createGame");
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

describe("CRUD de PlayLogs", () => {
  it("Cria um novo playlog", () => {
    cy.get("[testid=navbar-playlogs-link]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/playlogs`);

    cy.get("[testid=listlayout-title]").should("have.text", "PlayLogs");
    cy.get("[testid=listlayout-add-btn]").should("be.visible").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/playlogs/new`);

    cy.get("[testid=formlayout-title]").should("have.text", "PlayLog");

    cy.wait(1000);
    
    cy.get("#react-select-3-placeholder").click({ force: true });
    
    cy.contains(".react-select__option", "João Pedro").click();

    cy.get("#react-select-5-placeholder").click({ force: true });
    
    cy.contains(".react-select__option", "Red Dead Redemption 2").click();

    cy.get("[testid=playlogform-status-select]").select("Jogando");
    cy.get("[testid=playlogform-progress-input]").type("45");
    cy.get("[testid=formlayout-submit-btn]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/playlogs`);
    
    cy.contains("PlayLog adicionado com sucesso!").should("be.visible");
  });

  it("Acessa a página com a lista de playlogs", () => {
    cy.visit("/playlogs");

    cy.get("[testid=listlayout-title]").should("have.text", "PlayLogs");
    cy.get("table").should("be.visible");
    cy.get("[testid=listlayout-row-0]").should("be.visible");
    cy.get("[testid=listlayout-user_name-cell-0]").should("have.text", "João Pedro");
  });

  it("Visualiza os detalhes de um playlog", () => {
    cy.visit("/playlogs");

    cy.get("[testid=listlayout-title]").should("have.text", "PlayLogs");
    cy.get("[testid=listlayout-user_name-cell-0]").should("have.text", "João Pedro");
    cy.get("[testid=listlayout-row-0]").within(() => {
      cy.get("[testid=actionbuttons-view-btn]").click();
    });

    cy.url().should("include", `${Cypress.config().baseUrl}/playlogs/`);

    cy.get("[testid=detaillayout-title]").should("have.text", "Detalhes do PlayLog");
    cy.get("[testid=detaillayout-back-btn]").should("be.visible");
    cy.get("[testid=detaillayout-edit-btn]").should("be.visible");
    cy.get("[testid=detaillayout-user-value]").should("have.text", "João Pedro");
    cy.get("[testid=detaillayout-game-value]").should("have.text", "Red Dead Redemption 2");
    cy.get("[testid=detaillayout-status-value]").should("have.text", "Jogando");
    cy.get("[testid=detaillayout-progress-value]").should("have.text", "45%");
  });

  it("Edita um playlog existente", () => {
    cy.visit("/playlogs");

    cy.get("[testid=listlayout-title]").should("have.text", "PlayLogs");
    cy.get("[testid=listlayout-user_name-cell-0]").should("have.text", "João Pedro");
    cy.get("[testid=listlayout-row-0]").within(() => {
      cy.get("[testid=actionbuttons-edit-btn]").click();
    });

    cy.url().should("include", `${Cypress.config().baseUrl}/playlogs/`);

    cy.get("[testid=formlayout-title]").should("have.text", "PlayLog");
    cy.get("[testid=playlogform-progress-input]").click().wait(500).clear().wait(500).type("80");
    cy.get("[testid=formlayout-submit-btn]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/playlogs`);

    cy.contains("PlayLog atualizado com sucesso!").should("be.visible");

    cy.get("[testid=listlayout-progress-cell-0]").should("have.text", "80%");
  });

  it("Deleta um playlog", () => {
    cy.visit("/playlogs");

    cy.get("[testid=listlayout-title]").should("have.text", "PlayLogs");
    cy.get("[testid=listlayout-user_name-cell-0]").should("have.text", "João Pedro");
    cy.get("[testid=listlayout-row-0]").within(() => {
      cy.get("[testid=actionbuttons-delete-btn]").click();
    });
    cy.get("[testid=listlayout-no-records]").should("be.visible");
  });
});
