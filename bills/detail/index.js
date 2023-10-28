import {
  getListCartFromLocalStorage,
  getListSPFromLocalStorage,
  getOrderDetailFromLocalStorage,
  getOrdersAPI,
} from "../../utils/index.js";

const bodyOrderDetail = document.querySelector(".view_detail-body");
const quantityBillElement = document.querySelector(".quantity_bill-number");

const getFromLocalStorage = (key) => {
  let data = JSON.parse(localStorage.getItem(key));
  if (data) {
    return data;
  }
  return {};
};

var listSP = getListSPFromLocalStorage();
var orderDetail = getOrderDetailFromLocalStorage();
if (orderDetail) {
  let idSP = orderDetail.inforsOrders.idSP;
  let inforsSP = listSP.find((item) => item.id === idSP);
  const trOrderDetailElement = document.createElement("tr");
  trOrderDetailElement.innerHTML = `
    <td>${orderDetail.nameCustomer}</td>
    <td>${orderDetail.inforsOrders.id}</td>
    <td class="d-flex">
        <img
        class="view_detail-image-product"
        src="${inforsSP.image}"
        href="logo product"
        />
        <div class="view_detail-infors-product">
        <p class="view_detail-name-product">${inforsSP.name}</p>
        <p class="view_detail-price-product">Price: $${inforsSP.price.toLocaleString(
          "en-US"
        )}</p>
        </div>
    </td>
    <td>${orderDetail.inforsOrders.dateOrder}</td>
    <td>${orderDetail.inforsOrders.itemNumbers.toLocaleString("en-US")}</td>
    <td>$${orderDetail.inforsOrders.totalPrice.toLocaleString("en-US")}</td>`;
  bodyOrderDetail.appendChild(trOrderDetailElement);
}

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
  let quantityCartElement = document.querySelector(".quantity_cart");
  let quantityCartNumberElement = document.querySelector(
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
