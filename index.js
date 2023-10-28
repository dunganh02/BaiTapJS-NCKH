import {
  saveListSPToLocalStorage,
  getListSPFromLocalStorage,
  getListCartFromLocalStorage,
  saveListCartToLocalStorage,
  sumArr,
  getOrdersAPI,
} from "./utils/index.js";

const appContentListItem = document.querySelector(".app_content-list-items");

var listData =
  getListSPFromLocalStorage().length > 0
    ? getListSPFromLocalStorage()
    : [
        {
          id: 1,
          image:
            "https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.3/w_467,c_limit/3c9839ad-9907-477e-8d9e-4347d155c726/air-force-1-07-shoe-pZBS0b.png",
          name: "Nike Air Force 1 Mid '07",
          price: 1000,
          quantity: 111,
        },
        {
          id: 2,
          image:
            "https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.3/w_467,c_limit/39887545-1b81-4cdd-bb14-8695fa2058fa/air-force-1-react-shoes-mm8pv3.png",
          name: "Nike Court Vision Low Next Nature",
          price: 1200,
          quantity: 222,
        },
        {
          id: 3,
          image:
            "https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.3/w_467,c_limit/51fd150a-29bc-4385-b0b3-dd29f6487d60/air-max-systm-shoes-hLmQ85.png",
          name: "Nike Invincible 3",
          price: 2000,
          quantity: 8,
        },
        {
          id: 4,
          image:
            "https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.3/w_467,c_limit/eb3bf50a-8650-45c5-a9e2-41cd531f6640/court-vision-low-next-nature-shoes-N2fFHb.png",
          name: "Nike Air Force 2",
          price: 890,
          quantity: 12,
        },
        {
          id: 5,
          image:
            "https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.3/w_467,c_limit/2a344274-603c-4af4-b54d-a0f8945cd05e/air-force-1-07-shoe-B3pSxK.png",
          name: "Nike Air Force 1 '07",
          price: 999,
          quantity: 56,
        },
        {
          id: 6,
          image:
            "https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.3/w_467,c_limit/4b01d5d6-67c4-4f92-9c08-8c8b685221d0/structure-24-road-running-shoes-9wCgmv.png",
          name: "Nike Structure 24",
          price: 450,
          quantity: 232,
        },
        {
          id: 7,
          image:
            "https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.3/w_467,c_limit/70bc17fe-951a-439a-8641-a3f9a4208a56/air-max-1-86-og-g-nrg-golf-shoes-kp9PLm.png",
          name: "Nike Air Max 1 '86 OG G NRG",
          price: 1234,
          quantity: 8,
        },
        {
          id: 8,
          image:
            "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/51fd150a-29bc-4385-b0b3-dd29f6487d60/air-max-systm-shoes-hLmQ85.png",
          name: "Nike Air Max SYSTM",
          price: 856,
          quantity: 100,
        },
      ];

saveListSPToLocalStorage(listData);

const renderListItem = () => {
  if (listData.length > 0) {
    listData.map((item) => {
      let itemElement = document.createElement("div");
      itemElement.classList.add("item");
      itemElement.classList.add(`item-${item.id}`);
      //   itemElement.setAttribute("data-id", item.id);
      itemElement.innerHTML = `<span class="item_image">
        <img
          class="item_image-shoes"
          src=${item.image}
          alt="nike-shoes"
        />
        <button class="bg-icon-add-to-cart">
          <img
            class="icon-add-to-cart"
            src="https://cdn-icons-png.flaticon.com/512/4379/4379542.png"
            alt=""
          />
        </button>
      </span>
      <p class="item_name">${item.name}</p>
      <div class="item_price-quatity">
        <p class="item_price">$${item.price}</p>
        <p class="item_quatity">Quatity: ${item.quantity}</p>
      </div>`;
      appContentListItem.appendChild(itemElement);
    });
  }
};

renderListItem();

var arrCart = getListCartFromLocalStorage();
const addSP = (index) => {
  let cart = {
    idSP: index,
    soLuong: 1,
  };

  let checkExistence = arrCart.find((item) => {
    return item.idSP === index;
  });

  if (checkExistence) {
    arrCart = arrCart.map((item) => {
      if (item.idSP === checkExistence.idSP) {
        item.soLuong++;
      }
      return item;
    });
  } else {
    arrCart = [...arrCart, cart];
  }
};

listData.map((item) => {
  let itemElement = document.querySelector(`.item-${item.id}`);
  let btnAddToCart = itemElement.querySelector(".bg-icon-add-to-cart");
  btnAddToCart.onclick = () => {
    addSP(item.id);
    saveListCartToLocalStorage(arrCart);
    updateQuantityCart();
  };
});

getOrdersAPI().then((result) => {
  const quantityBillElement = document.querySelector(".quantity_bill-number");
  if (result && result.data && result.data.length > 0) {
    quantityBillElement.innerText = `(${result.data.length})`;
  } else {
    quantityBillElement.innerText = ``;
  }
});

const updateQuantityCart = () => {
  let listCart = getListCartFromLocalStorage();
  const quantityCartElement = document.querySelector(".quantity_cart");
  const quantityCartNumberElement = document.querySelector(
    ".quantity_cart-number"
  );
  if (listCart.length > 0) {
    quantityCartElement.classList.remove("d-none");
    let quantityCart = listCart.length;
    quantityCartNumberElement.innerText = quantityCart;
  } else {
    quantityCartElement.classList.add("d-none");
    quantityCartNumberElement.innerText = 0;
  }
};
updateQuantityCart();
