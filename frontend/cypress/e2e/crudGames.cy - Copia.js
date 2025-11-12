before(() => {
  cy.task("cleanDatabase");
  cy.task("createAdminUser");
  cy.task("createGame");

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

describe("CRUD de Jogos", () => {
  it("Acessa a página com a lista de jogos", () => {
    cy.get("[testid=navbar-games-link]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/games`);

    cy.get("[testid=listlayout-title]").should("have.text", "Jogos");
    cy.get("table").should("be.visible");
    cy.get("[testid=listlayout-row-0]").should("be.visible");
    cy.get("[testid=listlayout-title-cell-0]").should("have.text", "Red Dead Redemption 2");
  
    cy.visit("/games");

    cy.get("[testid=listlayout-title]").should("have.text", "Jogos");
    cy.get("[testid=listlayout-add-btn]").should("be.visible").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/games/new`);

    cy.get("[testid=formlayout-title]").should("have.text", "Jogo");
    cy.get("[testid=gameform-title-input]").type("The Witcher 3: Wild Hunt");
    cy.get("[testid=gameform-slug-input]").type("the-witcher-3-wild-hunt");
    cy.get("[testid=gameform-type-input]").type("game");
    cy.get("[testid=gameform-release-date-input]").type("2015-05-19");
    cy.get("[testid=gameform-platforms-input]").type("PC (Microsoft Windows){enter}").type("PlayStation 4{enter}");
    cy.get("[testid=gameform-genres-input]").type("Role-playing (RPG){enter}").type("Adventure{enter}");
    cy.get("[testid=gameform-developers-input]").type("CD Projekt Red{enter}");
    cy.get("[testid=formlayout-submit-btn]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/games`);

    cy.contains("Jogo adicionado com sucesso!").should("be.visible");
  
    cy.visit("/games");

    cy.get("[testid=listlayout-title]").should("have.text", "Jogos");
    cy.get("[testid=listlayout-title-cell-0]").should("have.text", "The Witcher 3: Wild Hunt");
    cy.get("[testid=listlayout-row-0]").within(() => {
      cy.get("[testid=actionbuttons-view-btn]").click();
    });

    cy.url().should("include", `${Cypress.config().baseUrl}/games/`);

    cy.get("[testid=detaillayout-title]").should("have.text", "Detalhes do jogo");
    cy.get("[testid=detaillayout-back-btn]").should("be.visible");
    cy.get("[testid=detaillayout-edit-btn]").should("be.visible");
    cy.get("[testid=detaillayout-title-value]").should("have.text", "The Witcher 3: Wild Hunt");
    cy.get("[testid=detaillayout-slug-value]").should("have.text", "the-witcher-3-wild-hunt");
    cy.get("[testid=detaillayout-type-value]").should("have.text", "game");
    cy.get("[testid=detaillayout-release-date-value]").should("have.text", "19/05/2015");
    cy.get("[testid=detaillayout-platforms-value]").should("have.text", "PC (Microsoft Windows), PlayStation 4");
    cy.get("[testid=detaillayout-genres-value]").should("have.text", "Role-playing (RPG), Adventure");
    cy.get("[testid=detaillayout-developers-value]").should("have.text", "CD Projekt Red");
  
    cy.visit("/games");

    cy.get("[testid=listlayout-title]").should("have.text", "Jogos");
    cy.get("[testid=listlayout-title-cell-0]").should("have.text", "The Witcher 3: Wild Hunt");
    cy.get("[testid=listlayout-row-0]").within(() => {
      cy.get("[testid=actionbuttons-edit-btn]").click();
    });

    cy.url().should("include", `${Cypress.config().baseUrl}/games/`);

    cy.get("[testid=formlayout-title]").should("have.text", "Jogo");
    cy.get("[testid=gameform-title-input]").click().wait(500).clear().wait(500).type("The Witcher 3: Wild Hunt - Edição Completa");
    cy.get("[testid=formlayout-submit-btn]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/games`);

    cy.contains("Jogo atualizado com sucesso!").should("be.visible");

    cy.get("[testid=listlayout-title-cell-0]").should("have.text", "The Witcher 3: Wild Hunt - Edição Completa");
  
    cy.visit("/games");

    cy.get("[testid=listlayout-title]").should("have.text", "Jogos");
    cy.get("[testid=listlayout-title-cell-0]").should("have.text", "The Witcher 3: Wild Hunt - Edição Completa");
    cy.get("[testid=listlayout-row-0]").within(() => {
      cy.get("[testid=actionbuttons-delete-btn]").click();
    });
    cy.get("[testid=listlayout-title-cell-0]").should("have.text", "Red Dead Redemption 2");
  });
});
