class Home {
  /**
   * Creates an instance of Home.
   * @memberof Home
   */
  constructor(self) {
    this.self = self;
    this.getAllProductItems();
  }

  /**
   * Affiche la liste de tous les produits disponibles dans le backend
   *
   * @memberof Home
   */
  async getAllProductItems() {
    let content = '';
    try {
      const products = await orinocoApi.apiDatas.allProductItems();
      for (let p = 0; p < products.length; p += 1) {
        const unitPrice = orinocoApi.apiDatas.formatLocaleMoney(
          products[p].price / 100
        );
        content += Home.buildHtmlProduct(products[p], unitPrice);
      }
    } catch (err) {
      console.error(err);
    }
    this.self.innerHTML = content;
    this.addInMyCartClick();
  }

  /**
   * Construit le HTML de la présentation de la liste des produit
   *
   * @param   {Object} product  Objet retourné par le backend
   * @return  {HTMLElement}     Html construit
   * @memberof Home
   */
  static buildHtmlProduct(product, unitPrice) {
    const resultHtml = `
      <div class="col-md-4 col-sm-12 mb-4">
        <div class="card" data-id="${product._id}">
            <a href="produit.html?id=${product._id}">
                <figure>
                    <img src="${product.imageUrl}" class="card-img-top" alt="${product.description}">
                </figure>
            </a>
            <div class="card-body">
                <h2 class="card-title">${product.name} </h2>
                <div class="card-text">${product.description} </div>
                <div class="row pt-3">
                    <div class="col">
                        <div class="prix text-danger">${unitPrice}</div>
                    </div>
                    <div class="col">
                        <a href="#" class="btn btn-success add-in-cart" data-id="${product._id}"><i class="fas fa-cart-plus"></i> Ajouter</a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `;

    return resultHtml;
  }

  /**
   * Permet d'ajouter dans le panier un produit directement depuis la liste
   * sans rentrer sur la page du produit
   *
   * @memberof Home
   */
  addInMyCartClick() {
    this.self.querySelectorAll('a.add-in-cart').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const product = event.target.getAttribute('data-id');
        orinocoApi.apiDatas.addInCart(product, 1);
        const modalBody =
          'Félicitation, votre produit est ajouté au panier!<br>Vous souhaitez continuer vos achats ou aller directement au panier?';
        orinocoApi.apiDatas.modalPopup('Ajouté au panier', modalBody, true);
      });
    });
  }
}
