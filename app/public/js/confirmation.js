class Confirmation {
  constructor(self) {
    this.self = self;
    this.removeCart();
  }

  /**
   * Efface le panier dans le localstorage et appel confirmationHtml()
   *
   * @memberof Confirmation
   */
  removeCart() {
    localStorage.removeItem('cart');
    this.confirmationHtml();
  }

  /**
   * Construit le html de confirmation de la commanded
   *
   * @memberof Confirmation
   */
  confirmationHtml() {
    const contact = JSON.parse(localStorage.getItem('contact'));
    const orderId = new URLSearchParams(
      document.location.search.substring(1)
    ).get('orderId');
    const totalOrder = orinocoApi.apiDatas.formatLocaleMoney(
      JSON.parse(localStorage.getItem('total'))
    );

    this.self.innerHTML = `
    <section class="confirmationWrapper">
      <div class="container">
        <div class="row">
          <div class="col-md-12 section-title">
            <h1>Cher <b>${contact.firstName} ${contact.lastName}</b>, nous avons le plaisir de vous confirmer votre commande
            et vous remercions pour votre achat !</h1>
          </div>
          <div class="col-md-12 text-center">
            <p>
              Votre commande n° <b>${orderId}</b> d'un montant de <span id="totalOrder"><b>${totalOrder}</b></span> a été validée.
            </p>
            <p>
              Vous recevrez votre facture par mail à l'adresse <span id="orderMail"><b>${contact.email}</b></span>.
            </p>
            <p>
              L'équipe d'Orinoco vous remercie pour votre confiance !
            </p>
          </section>
          <div>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}
