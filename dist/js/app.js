

// Variable declarations
const menuBtn = document.querySelector('.fa-bars');
const closeMenuBtn = document.querySelector('.fa-window-close');
const menuOverlay = document.querySelector('.menu-overlay');
const menuDOM = document.querySelector('.menu');

const cartBtn = document.querySelector('.cart-btn');
const cartDOM = document.querySelector('.cart');
const cartTotal = document.querySelector('.cart-total');
const cartItems = document.querySelector('.cart-items');
const cartContent = document.querySelector('.cart-content');
const clearCartBtn = document.querySelector('.clear-cart');

const productDOM = document.querySelector('.product-center');

let products = [];
let cart = [];
let buttonsDOM = [];



( getProducts = () => {
  fetch('products.json')
    .then(function(response){
      console.log(response)
      return response.json()
    })
    .then(data => {
      console.log(data)
      // Files I want to work with from this array are id, image, price, title, will have to use destructuring to achieve that
      loadedProducts = data.items;
      // console.log(loadedProducts)
      products = loadedProducts.map( item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image  = item.fields.image.fields.file.url;
        // console.log({title, price, id, image})
        return { title, price, id, image}
      })
      // console.log(products)
      // return products
      startApp()
      // console.log(products)
    })
    .catch((error) => {
      console.log(error)
    })
})()
// getProducts()


startApp = () => {
  // console.log(products)
 
  displayProducts()
  setupAPP()
  saveProducts()
  getProduct()
  getBagButtons()
  cartLogic()
}

const displayProducts = () => {
  // console.log(products)
  let result = '';
  for(let product of products){
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
    `
    // console.log(product)
  }
  productDOM.innerHTML = result;
}


const getBagButtons = () => {
  // console.log(products)
  // Forms a NodeList Question of the day: How to turn a nodelist into an array?
  const buttonz = document.querySelectorAll('.bag-btn');


  // Forms an Array with the help of the spread operator
  // The reason why we had to initialize the bottons here is if we had done that at the beggining prior to the products loading, the bottons will return an empty nodelist
  const buttons = [...document.querySelectorAll('.bag-btn')];
  buttonsDOM = buttons;
  buttons.forEach((button) => {

    // we will be using the id to recieve the information of a particular product in the product array stored in the localstorage
    let id = button.dataset.id;
    let inCart = cart.find((item) =>  item.id === id );
     // This happens immediately the program loads, searches for items in cart and labels them in cart and disables the button
    if(inCart){
      button.innerText = 'in cart';
      button.disabled = true;
    }
    button.addEventListener('click', (e) => {
      console.log(e.target)
      e.target.innerText = 'in cart';
      e.target.disabled = true;
      // get the product from products based on the ID
      let cartItem = {...getProduct(id), amount: 1};
      //add product to cart
      cart = [...cart, cartItem]
      //save cart values
      saveCart(cart)
      //set cart values
      setCartValues(cart)
      // display cart item
      addCartItem(cartItem)
      
      console.log(cart, cartItem)
    })
  })

  // console.log(buttons, typeof(buttons), Array.isArray(buttons))
}

const setCartValues = (cart) => {
  let tempTotal = 0;
  let itemsTotal = 0;
  cart.map((item) => {
    tempTotal += item.price * item.amount;
    itemsTotal += item.amount;
    console.log(tempTotal);
    console.log(itemsTotal)
  })
  cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
  cartItems.innerText = itemsTotal;
  
}

const addCartItem = (item) => {
  console.log(item)
  const div = document.createElement('div');
  div.classList.add('cart-item');
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
  console.log(cartContent);
}

const setupAPP = () => {
  cart = getCart();
  console.log(cart)
  setCartValues(cart)
  populateCart(cart)
}

const populateCart = (cart) => {
  console.log(cart)
  cart.forEach(item => {
    console.log(item)
    addCartItem(item)
  })
}

const cartLogic = () => {
  clearCartBtn.addEventListener('click', clearCart);
  console.log(cartContent)
  cartContent.addEventListener('click', (e)=> {
    console.log(e.target)
    if(e.target.classList.contains('remove-item')){
      let removeItem = e.target;
      let id = removeItem.dataset.id;
      cartContent.removeChild(removeItem.parentElement.parentElement);
      this.removeItem(id)
      console.log(id)
    }
  })
}

const clearCart = (e) => {
  console.log(e.target)
  const cartItems = cart.map(item => {return item.id; console.log( item, item.id)})
  console.log(cartItems)
  cartItems.forEach(id => {return removeItem(id); console.log(id)})

  console.log(cartContent.children);

  while(cartContent.children.length > 0){
    cartContent.removeChild(cartContent.children[0])
  }

  showCart()
}

const removeItem = (id) => {
  console.log(id)
  console.log(cart)
  cart = cart.filter(item => item.id !== id)
  setCartValues(cart)
  saveCart(cart)
  let button = getSingleButton(id)
  button.disabled = false;
  button.innerHTML = `
    <i class="fas fa-shopping-cart"></i>add to cart 
  `;
}

const getSingleButton = (id)=> {
  return buttonsDOM.find(button => button.dataset.id === id)
  console.log(id)
  console.log(buttonsDOM)
}


// Functions For Local Storage 
const saveProducts = () => {
  localStorage.setItem('goods', JSON.stringify(products));
}

const getProduct = (id) => {
  let goods = JSON.parse(localStorage.getItem('goods'));
  // This searches through the saved products array inside the local storage by id, and if id is found it 
  return goods.find(product =>  product.id === id );
}

const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

const getCart = () => {
  return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
}











const showMenu = () => {
  menuOverlay.classList.add('transparentBcg');
  menuDOM.classList.add('showMenu');
}

const closeMenu = () => {
  menuOverlay.classList.remove('transparentBcg');
  menuDOM.classList.remove('showMenu');
}

const showCart = () => {
  cartDOM.classList.toggle('showCart');
}




menuBtn.addEventListener('click', showMenu);
closeMenuBtn.addEventListener('click', closeMenu);
cartBtn.addEventListener('click', showCart);

