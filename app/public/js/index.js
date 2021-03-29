const orinocoApi = {
  apiDatas: new apiDatas('http://localhost:3000/api/cameras/')
};

/**
 * Permet d'instancier les classes selon les pages
 *
 * @return {Object}
 */
function definePage() {
  const searchParams = new URLSearchParams(
    document.location.search.substring(1)
  );
  const params = searchParams.get('id');
  const url = window.location.pathname;

  switch (url) {
    case '/produit.html':
      return new Product(document.querySelector('#product-view'), params);
    case '/cart.html':
      return new CartPage(document.querySelector('tbody.cart-table-line'));
    case '/confirmation.html':
      return new Confirmation(
        document.querySelector('main.confirmation-content')
      );
    default:
      return new Home(document.querySelector('#product_list'));
  }
}
orinocoApi.page = this.definePage();
