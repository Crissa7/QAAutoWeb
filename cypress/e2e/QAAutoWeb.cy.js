/// <reference types="cypress" />

//This project is small so no variables have been extracted to a separate file.
const URL = "https://www.innocv.com/";
const CONTACT_LINK = "a[href='/contacto']";
const COOKIES_CONFIRM_BUTTON = "#rcc-confirm-button";
const PHONE = "[style='color:#ffffff'] > :nth-child(3)";
const LEGAL_NOTICE_LINK = "a[href='aviso-legal']";
const HAVE_LENGTH = "have.length";
const HAVE_CSS = "have.css";
const SEND_REPORT = "Enviar formulario";
const REQUIRED_FIELD = "Campo requerido";
const NEWS_LINK = "noticias";
const COLOR = "color";
const RGB_RED = "rgb(244, 67, 54)";
const SPANISH_DATE_REGEX = /\d{2}-\d{2}-\d{4}/;
const NEWS_SECTION = "article > section";

describe("QAAutoWeb", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit(URL);
    cy.get(COOKIES_CONFIRM_BUTTON).click();
    cy.get(CONTACT_LINK).click();
  });

  it("Compare two phones", () => {
    cy.get(PHONE).then(($el) => {
      let phone = $el.text();
      const prefix = "(+34) ";
      const empty = "";
      phone = phone.replace(prefix, empty);

      cy.get(LEGAL_NOTICE_LINK).click();
      cy.contains(phone);
    });
  });

  it("Obtain how many times Faraday appears", () => {
    const faradayRepetitions = 3;
    cy.get("p:contains('Faraday')").should(HAVE_LENGTH, faradayRepetitions);
  });

  it("Required text in red", () => {
    cy.contains(SEND_REPORT).click();
    cy.contains(REQUIRED_FIELD).should(HAVE_CSS, COLOR, RGB_RED);
  });

  it("Read News dates", () => {
    const today = new Date();

    cy.contains(NEWS_LINK).scrollIntoView();
    cy.get(NEWS_SECTION, { timeout: 10000 }).each(($section) => {
      cy.wrap($section)
        .contains(SPANISH_DATE_REGEX)
        .then((date) => {
          const split = date.text().split("-");
          const day = split[0];
          const month = split[1];
          const year = split[2];
          const newsDate = new Date(year, month - 1, day);

          expect(today.getMonth() - newsDate.getMonth()).to.be.lessThan(2);
        });
    });
  });
});
