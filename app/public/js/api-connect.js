class apiDatas {
  productItems = null;
  product = null;

  /**
   * Creates an instance of apiDatas.
   * @param {*} self
   * @memberof apiDatas
   */
  constructor(self) {
    this.self = self;
    this.cartList();
  }

  /**
   * Permet d'appeler tous les produits depuis le backend
   *
   * @return  {Array}   Retourne la liste des ID produits
   * @memberof apiDatas
   */
  async allProductItems() {
    if (this.productItems !== null) return this.productItems;
    const data = await fetch(this.self);
    this.productItems = await data.json();
    this.countCart();
    return this.productItems;
  }

  /**
   * Appel d'un produit unique depuis le backend avec l'id du produit
   *
   * @param   {String}  productId   Id du produit
   * @return  {Object}  Retourne l'objet du produit
   * @memberof apiDatas
   */
  async productItem(productId) {
    if (productId !== null) {
      let apiUrl = 'http://localhost:3000/api/cameras/';
      let apiUrlProduct = apiUrl.concat('', productId);
      let result = null;
      const productData = await fetch(apiUrlProduct);
      this.product = await productData.json();

      return this.product;
    }
  }

  /**
   * Boucle d'ajout de quantité de produit dans le panier
   *
   * @param   {String}  productId   Id du produit
   * @param   {Number}  [qty=1]     Quantité du produit (par défaut 1)
   * @memberof cart
   */
  addInCart(productId, qty = 1) {
    for (let i = 1; i <= qty; i++) {
      this.setCart(productId);
    }
  }

  /**
   * Ajout d'un produit dans le panier et stockage dans le localstore
   *
   * @param   {String}  cart  Id du produit à ajouter au panier
   * @memberof apiDatas
   */
  setCart(cart) {
    if (cart !== null) {
      let productItemStorage = [];
      if (localStorage.getItem('cart') !== null) {
        productItemStorage = JSON.parse(localStorage.getItem('cart')) || [];
      }
      productItemStorage.push(cart);

      localStorage.setItem('cart', JSON.stringify(productItemStorage));
    }
    this.countCart();
    this.cartList();
  }

  /**
   * Affiche les produits du panier stocké dans le localstorage
   *
   * @return  {Array}   return un tableau avec les ID produits
   * @memberof apiDatas
   */
  getCart() {
    return localStorage.getItem('cart') === null
      ? []
      : localStorage.getItem('cart');
  }

  /**
   * Permet d'effacer un article du panier
   *
   * @param   {String}  productId Id du produit
   * @memberof apiDatas
   */
  removeProductInCart(productId) {
    const newCart = [];
    let cart = JSON.parse(this.getCart());
    for (let i = 0, size = cart.length; i < size; i++) {
      if (cart[i] !== productId) newCart.push(cart[i]);
    }
    localStorage.removeItem('cart');

    for (let x = 0, size = newCart.length; x < size; x++) {
      this.setCart(newCart[x]);
    }
    this.cartList();
  }

  /**
   * Retourne le nombre d'articles dans le panier et les affiche sur l'icone de pannier
   *
   * @memberof apiDatas
   */
  countCart() {
    let cartContent = this.getCart();

    if (cartContent.length > 0) {
      cartContent = JSON.parse(this.getCart());
    } else {
      cartContent = 0;
    }

    if (cartContent !== 0) {
      document.getElementsByClassName('total-count')[0].innerText =
        cartContent.length;
      document.getElementsByClassName('shop-cart-items')[0].innerText =
        cartContent.length + ' Article(s)';
    }
  }

  /**
   * Regroupe les id identiques des articles dans le panier
   *
   * @return  {Object}  retourne un objet
   * key            | value
   * id produit     | quantité total correspondant à l'ID du produit
   * @memberof apiDatas
   */
  groupCart() {
    let cardDict = {};
    if (this.getCart().length !== 0) {
      const cartContent = JSON.parse(this.getCart());

      for (let i = 0; i < cartContent.length; i++) {
        if (cardDict[cartContent[i]]) {
          cardDict[cartContent[i]] += 1;
        } else {
          cardDict[cartContent[i]] = 1;
        }
      }
    }
    return cardDict;
  }

  /**
   * Affiche les produits du panier dans une mini liste lorsqu'on
   * survole l'icone du panier
   *
   * @memberof apiDatas
   */
  async cartList() {
    if (this.getCart().length !== 0) {
      let cartContent = this.groupCart();
      let content = '';
      let total = 0;

      if (cartContent) {
        for (const [key, value] of Object.entries(cartContent)) {
          const product = await this.productItem(key);
          total += (product.price / 100) * value;
          content += this.buildMiniCartListHtml(product, value);
        }

        document.getElementsByClassName('shopping-list')[0].innerHTML = content;
        document.getElementsByClassName('total')[0].innerHTML =
          this.formatLocaleMoney(total);
      }
    }
    this.countCart();
  }

  /**
   * Construit le HTML de la liste du panier s'affichant sur l'icone
   *
   * @param   {Object}  product   Objet du produit avec valeurs
   * @param   {Number}  [qty=1]    La quantité total de chaque produit dans le panier
   * @return  {String}
   * @memberof apiDatas
   */
  buildMiniCartListHtml(product, qty = 1) {
    return `
    <li>
      <a class="cart-img" href="#"><img src="${product.imageUrl}" alt="${
      product.description
    }"></a>
      <h4><a href="#">${product.name}</a></h4>
      <p class="quantity">${qty}x - <span class="amount">${
      this.formatLocaleMoney((product.price / 100))
    } </span></p>

    </li>
    `;
  }

  /**
   * Retourne un nombre formaté en monnaie locale
   *
   * @param {Number} total  Le nombre à convertir
   * @return {Number}   Le nombre formaté localement
   * @memberof apiDatas
   */
  formatLocaleMoney(total) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(total);
  }

  /**
   * Envoi la commande des produits dans le panier au backend
   *
   * contact: {
   *   firstName: string,
   *   lastName: string,
   *   address: string,
   *   city: string,
   *   email: string
   * }
   * products: [string] <-- array of product _id
   *
   * @param   {Object}  orderItems
   * @memberof apiDatas
   */
  orderCamerasInCart(orderItems) {
    fetch('http://localhost:3000/api/cameras/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: orderItems
    })
      .then((result) => {
        return result.json();
      })
      .then((confirmation) => {
        window.location.assign(
          './confirmation.html?orderId=' + confirmation.orderId
        );
      })
      .catch((err) => {
        console.error('erreur : ' + err.name);
      });
  }

  /**
   * Function permettant d'afficher une fenetre modal
   *
   * @param {HTMLElement} title
   * @param {HTMLElement} content
   * @param {boolean} [goCart=false]
   * @memberof apiDatas
   */
  modalPopup(title, content, goCart = false) {
    const modal = document.getElementById('orinocoModal');
    const titleContent = document.getElementsByClassName('modal-title')[0];
    const bodyContent = document.getElementById('modal-body');
    const span = document.getElementsByClassName('close')[0];
    const footer = document.getElementsByClassName('modal-footer')[0];
    const closeBtn = document.getElementsByClassName('close-btn')[0];

    modal.style.display = 'block';

    titleContent.innerHTML = title;
    bodyContent.innerHTML = content;

    if (goCart === true) {
      const cartButton = document.getElementById('get-cart-btn');
      cartButton.classList.add('visible');
      cartButton.classList.remove('invisible');
    }

    span.onclick = function () {
      modal.style.display = 'none';
    };
    closeBtn.onclick = function () {
      modal.style.display = 'none';
    };
  }
}
