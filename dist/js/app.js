// Variable declarations
const menuBtn = document.querySelector(".fa-bars");
const closeMenuBtn = document.querySelector(".fa-window-close");
const menuOverlay = document.querySelector(".menu-overlay");
const menuDOM = document.querySelector(".menu");
const cartBtn = document.querySelector(".cart-btn");
const cartDOM = document.querySelector(".cart");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCartBtn = document.querySelector(".clear-cart");
const productDOM = document.querySelector(".product-center");
let products = [];
let cart = [];
let buttonsDOM = [];

// Functions for menu and menu overlay
const showMenu = () => {
  menuOverlay.classList.add("transparentBcg");
  menuDOM.classList.add("showMenu");
};

const closeMenu = () => {
  menuOverlay.classList.remove("transparentBcg");
  menuDOM.classList.remove("showMenu");
};

// getting the products from an api
(getProducts = () => {
  fetch("products.json")
    .then(function(response) {
      console.log(response);
      return response.json();
    })
    .then(data => {
      loadedProducts = data.items;
      products = loadedProducts.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      startApp();
    })
    .catch(error => {});
})();

startApp = () => {
  displayProducts();
  setupAPP();
  saveProducts();
  getProduct();
  getBagButtons();
  cartLogic();
};

//displaying the products
const displayProducts = () => {
  let result = "";
  for (let product of products) {
    result += `
      <article class="product">
        <div class="img-container">
          <img src=${product.image} alt="product" class="product-img">
          <button class="bag-btn" data-id=${product.id}> 
            <i class="fas fa-shopping-cart"></i>add to cart 
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
    `;
  }
  productDOM.innerHTML = result;
};

const getBagButtons = () => {
  const buttonz = document.querySelectorAll(".bag-btn");
  const buttons = [...document.querySelectorAll(".bag-btn")];
  buttonsDOM = buttons;
  buttons.forEach(button => {
    let id = button.dataset.id;
    let inCart = cart.find(item => item.id === id);

    if (inCart) {
      button.innerText = "in cart";
      button.disabled = true;
    }
    button.addEventListener("click", e => {
      console.log(e.target);
      e.target.innerText = "in cart";
      e.target.disabled = true;
      let cartItem = { ...getProduct(id), amount: 1 };
      cart = [...cart, cartItem];
      saveCart(cart);
      setCartValues(cart);
      addCartItem(cartItem);
    });
  });
};

const setCartValues = cart => {
  let tempTotal = 0;
  let itemsTotal = 0;
  cart.map(item => {
    tempTotal += item.price * item.amount;
    itemsTotal += item.amount;
  });
  cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
  cartItems.innerText = itemsTotal;
};
// adds individual item to the cart
const addCartItem = item => {
  const div = document.createElement("div");
  div.classList.add("cart-item");
  div.innerHTML = `
    <img src=${item.image} alt="">
    <div class="">
      <h4>${item.title}</h4>
      <h5>$${item.price}</h5>
      <span class="remove-item" data-id = ${item.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id = ${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>
  `;
  cartContent.appendChild(div);
};

const showCart = () => {
  cartDOM.classList.toggle("showCart");
};

const setupAPP = () => {
  cart = getCart();
  setCartValues(cart);
  populateCart(cart);
  cartBtn.addEventListener("click", showCart);
  menuBtn.addEventListener("click", showMenu);
  closeMenuBtn.addEventListener("click", closeMenu);
};

const populateCart = cart => {
  cart.forEach(item => {
    addCartItem(item);
  });
};
// the functions that run inside the cart
const cartLogic = () => {
  clearCartBtn.addEventListener("click", clearCart);
  cartContent.addEventListener("click", e => {
    if (e.target.classList.contains("remove-item")) {
      let removeProd = e.target;
      let id = removeProd.dataset.id;
      cartContent.removeChild(removeProd.parentElement.parentElement);
      removeItem(id);
    } else if (e.target.classList.contains("fa-chevron-up")) {
      let addAmount = e.target;
      let id = addAmount.dataset.id;
      let tempItem = cart.find(item => item.id === id);
      tempItem.amount = tempItem.amount + 1;
      saveCart(cart);
      setCartValues(cart);
      addAmount.nextElementSibling.innerText = tempItem.amount;
    } else if (e.target.classList.contains("fa-chevron-down")) {
      let lowerAmount = e.target;
      let id = lowerAmount.dataset.id;
      let tempItem2 = cart.find(item => item.id === id);
      tempItem2.amount = tempItem2.amount - 1;
      if (tempItem2.amount > 0) {
        saveCart(cart);
        setCartValues(cart);
        lowerAmount.previousElementSibling.innerText = tempItem2.amount;
      } else {
        cartContent.removeChild(lowerAmount.parentElement.parentElement);
        removeItem(id);
      }
    }
  });
};
// to clear the cart items and exit the showcart
const clearCart = e => {
  const cartItems = cart.map(item => {
    return item.id;
  });
  cartItems.forEach(id => {
    return removeItem(id);
  });
  while (cartContent.children.length > 0) {
    cartContent.removeChild(cartContent.children[0]);
  }
  showCart();
};

const getSingleButton = id => {
  return buttonsDOM.find(button => button.dataset.id === id);
};

const removeItem = id => {
  cart = cart.filter(item => item.id !== id);
  setCartValues(cart);
  saveCart(cart);
  let button = getSingleButton(id);
  button.disabled = false;
  button.innerHTML = `
    <i class="fas fa-shopping-cart"></i>add to cart 
  `;
};

// Functions For Local Storage
const saveProducts = () => {
  localStorage.setItem("goods", JSON.stringify(products));
};
const getProduct = id => {
  let goods = JSON.parse(localStorage.getItem("goods"));
  return goods.find(product => product.id === id);
};
const saveCart = cart => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
const getCart = () => {
  return localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
};
