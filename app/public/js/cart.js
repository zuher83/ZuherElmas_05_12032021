class CartPage {
  /**
   * Creates an instance of CartPage.
   * @param {Objet} self
   * @memberof CartPage
   */
  constructor(self) {
    this.self = self;
    this.cartListProducts();
    CartPage.checkForm();
    this.validateOrder();
  }

  /**
   * Affiche la liste du panier dans un tableau Html. Les produits
   * sont regroupé par ID et les quantités additionnés
   *
   * Le total de la commande est mis à jour à chaque changement
   *
   * @memberof cartPage
   */
  async cartListProducts() {
    let content = '';
    let total = 0;
    try {
      const cartContent = await orinocoApi.apiDatas.groupCart();

      for (const [key, value] of Object.entries(cartContent)) {
        const product = await orinocoApi.apiDatas.productItem(key);
        total += (product.price / 100) * value;
        const totalLine = orinocoApi.apiDatas.formatLocaleMoney(
          (product.price / 100) * value
        );
        const unitPrice = orinocoApi.apiDatas.formatLocaleMoney(
          product.price / 100
        );
        content += CartPage.buildHtmlCartTable(
          product,
          unitPrice,
          value,
          totalLine
        );
      }
    } catch (err) {
      console.error(err);
    }

    if (content === '') {
      content = `<tr><td colspan="6" class="text-center">Votre panier est vide</td></tr>`;
    }

    this.self.innerHTML = content;
    this.updateTotalCart(total);
    this.removeProduct();
  }

  /**
   * Ajoute le montant total de la commande au pied et le stock dans le localstorage
   *
   * @param   {String}  total   Montant total de la commande converti en Number et formaté
   * @memberof cartPage
   */
  updateTotalCart(total) {
    document.querySelector(
      '.order-subtotal'
    ).innerHTML = orinocoApi.apiDatas.formatLocaleMoney(total);
    document.querySelector(
      '.order-paid'
    ).innerHTML = orinocoApi.apiDatas.formatLocaleMoney(total);
    localStorage.setItem('total', total);
  }

  /**
   * Injecte dans le tableau Html du panier chaque ligne de commande
   *
   * @param   {Object}  product Objet du produit
   * @param   {String}  product._id
   * @param   {String}  product.imageUrl
   * @param   {String}  product.name
   * @param   {String}  product.description
   * @param   {Number}  product.price
   * @param   {Number}  [qty=1] Quantité total de chaque produit
   * @param   {Number}  total  Montant total de chaque ligne de produit
   * @return  {HTMLElement} retourne une ligne <tr> avec les éléments Html
   * @memberof cartPage
   */
  static buildHtmlCartTable(product, unitPrice, qty = 1, total) {
    return `
      <tr id="${product._id}">
        <td class="image" data-title="No"><img src="${product.imageUrl}" alt="#"></td>
        <td class="product-des" data-title="Description">
          <p class="product-name"><a href="produit.html?id=${product._id}">${product.name}</a></p>
          <p class="product-des">${product.description}</p>
        </td>
        <td class="price" data-title="Price"><span>${unitPrice}</span></td>
        <td class="qty" data-title="Qty"><!-- Input Order -->
          <span>${qty}</span>
        </td>
        <td class="total-amount" data-title="Total"><span>${total}</span></td>
        <td class="action" data-title="Remove""><a href="#" class="remove" data-id="${product._id}"><i class="far fa-trash-alt"></i></a></td>
      </tr>
    `;
  }

  /**
   * Efface un produit du panier sur la page panier
   *
   * @memberof CartPage
   */
  removeProduct() {
    this.self.querySelectorAll('a.remove').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const product = item.getAttribute('data-id');
        orinocoApi.apiDatas.removeProductInCart(product);
        this.cartListProducts();
      });
    });
  }

  /**
   * Vérifie de manière dynamique le formulaire de client
   * Chaque champ et vérifié durant la saisie et une class et ajouté si valid ou invalid
   *
   * @memberof cartPage
   */
  static checkForm() {
    const firstName = document.getElementById('validationFirstName');
    const name = document.getElementById('validationName');
    const rue = document.getElementById('validationRue');
    const ville = document.getElementById('validationVille');
    const codePostal = document.getElementById('validationCodePostal');
    const email = document.getElementById('validatedInputEmail');
    const confirmationEmail = document.getElementById(
      'validatedInputEmailConfirmation'
    );
    const cgvAccept = document.getElementById('invalidCheck3');
    const postalRegex = /^\d{5}$|^\d{5}-\d{4}$/;
    const textRegex = /^[a-zA-Z0-9\s,'-]*$/;
    const emailRegex = /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;.](([a-zA-Z0-9_\-\.]+)@{[a-zA-Z0-9_\-\.]+0\.([a-zA-Z]{2,5}){1,25})+)*$/;

    firstName.addEventListener('input', () => {
      if (textRegex.test(firstName.value) === true && firstName.value !== '') {
        firstName.classList.add('is-valid');
        firstName.classList.remove('is-invalid');
      } else {
        firstName.classList.remove('is-valid');
        firstName.classList.add('is-invalid');
      }
    });

    name.addEventListener('input', () => {
      if (textRegex.test(name.value) === true && name.value !== '') {
        name.classList.add('is-valid');
        name.classList.remove('is-invalid');
      } else {
        name.classList.remove('is-valid');
        name.classList.add('is-invalid');
      }
    });

    rue.addEventListener('input', () => {
      if (textRegex.test(rue.value) === true && rue.value !== '') {
        rue.classList.add('is-valid');
        rue.classList.remove('is-invalid');
      } else {
        rue.classList.remove('is-valid');
        rue.classList.add('is-invalid');
      }
    });

    ville.addEventListener('input', () => {
      if (textRegex.test(ville.value) === true && ville.value !== '') {
        ville.classList.add('is-valid');
        ville.classList.remove('is-invalid');
      } else {
        ville.classList.remove('is-valid');
        ville.classList.add('is-invalid');
      }
    });

    codePostal.addEventListener('input', () => {
      if (
        postalRegex.test(codePostal.value) === true &&
        codePostal.value !== ''
      ) {
        codePostal.classList.add('is-valid');
        codePostal.classList.remove('is-invalid');
      } else {
        codePostal.classList.remove('is-valid');
        codePostal.classList.add('is-invalid');
      }
    });

    email.addEventListener('input', () => {
      if (emailRegex.test(email.value) === true && email.value !== '') {
        console.log(emailRegex.test(email.value));
        email.classList.add('is-valid');
        email.classList.remove('is-invalid');
        email.parentNode.classList.add('is-valid');
        email.parentNode.classList.remove('is-invalid');
      } else {
        email.classList.remove('is-valid');
        email.classList.add('is-invalid');
        email.parentNode.classList.remove('is-valid');
        email.parentNode.classList.add('is-invalid');
      }
    });

    confirmationEmail.addEventListener('change', () => {
      if (email.value === confirmationEmail.value) {
        confirmationEmail.classList.add('is-valid');
        confirmationEmail.classList.remove('is-invalid');
        confirmationEmail.parentNode.classList.add('is-valid');
        confirmationEmail.parentNode.classList.remove('is-invalid');
      } else {
        confirmationEmail.classList.remove('is-valid');
        confirmationEmail.classList.add('is-invalid');
        confirmationEmail.parentNode.classList.remove('is-valid');
        confirmationEmail.parentNode.classList.add('is-invalid');
      }
    });

    cgvAccept.addEventListener('change', () => {
      if (cgvAccept.checked) {
        cgvAccept.classList.add('is-valid');
        cgvAccept.classList.remove('is-invalid');
      } else {
        cgvAccept.classList.remove('is-valid');
        cgvAccept.classList.add('is-invalid');
      }
    });
  }

  /**
   * Vérifie si le pannier n'est pas vide au clique de validation
   * Si le panier est vide une alerte est envoyé sinon on appelle
   * la function formsubmit()
   *
   * @memberof cartPage
   */
  validateOrder() {
    document
      .getElementById('customer-form')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        if (orinocoApi.apiDatas.getCart().length > 0) {
          CartPage.formSubmit();
        } else {
          alert('Votre panier est vide! Merci de choisir un produit!');
        }
      });
  }

  /**
   * Vérification avant envoi au backend du formulaire et du contenu du panier
   *
   * Si tout est valide alors on envoi la requête à orderCamerasInCart() dans l'api fronted
   * pour soumission au backend
   *
   * @memberof cartPage
   */
  static formSubmit() {
    const firstName = document.getElementById('validationFirstName');
    const name = document.getElementById('validationName');
    const rue = document.getElementById('validationRue');
    const ville = document.getElementById('validationVille');
    const codePostal = document.getElementById('validationCodePostal');
    const email = document.getElementById('validatedInputEmail');
    const confirmationEmail = document.getElementById(
      'validatedInputEmailConfirmation'
    );
    const cgvAccept = document.getElementById('invalidCheck3');
    const postalRegex = /^\d{5}$|^\d{5}-\d{4}$/;
    const textRegex = /^[a-zA-Z0-9\s,'-]*$/;
    const emailRegex = /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;.](([a-zA-Z0-9_\-\.]+)@{[a-zA-Z0-9_\-\.]+0\.([a-zA-Z]{2,5}){1,25})+)*$/;

    if (textRegex.test(firstName.value) !== true || firstName.value === '') {
      alert("Merci d'indiquer votre prénom");
    }
    if (textRegex.test(name.value) !== true || name.value === '') {
      alert("Merci d'indiquer votre nom");
    }
    if (textRegex.test(rue.value) !== true || rue.value === '') {
      alert("Merci d'indiquer votre rue");
    }
    if (textRegex.test(ville.value) !== true || ville.value === '') {
      alert("Merci d'indiquer votre ville");
    }
    if (
      postalRegex.test(codePostal.value) !== true ||
      codePostal.value === ''
    ) {
      alert("Merci d'indiquer votre code postal");
    }
    if (
      emailRegex.test(email.value) !== true ||
      (email.value === '' && email.value !== confirmationEmail.value)
    ) {
      alert("Merci d'indiquer votre email");
    }
    if (cgvAccept.checked !== true) {
      alert("Merci d'accepter nos CGV");
    }

    // informations du contact
    const contact = {
      firstName: firstName.value,
      lastName: name.value,
      address: rue.value,
      city: ville.value,
      email: email.value
    };

    // ID des produits du panier
    const products = JSON.parse(orinocoApi.apiDatas.getCart());

    // @type {Object} on groupe les deux variables
    const orderCart = JSON.stringify({
      contact,
      products
    });

    localStorage.setItem('contact', JSON.stringify(contact));
    orinocoApi.apiDatas.orderCamerasInCart(orderCart);
  }
}
