import {
  saveListSPToLocalStorage,
  getListSPFromLocalStorage,
  getListCartFromLocalStorage,
  getOrdersAPI,
  deleteOrderAPI,
  saveOrderDetailToLocalStorage,
} from "../utils/index.js";

const ordersTable = document.querySelector(".orders_content-table-orders");
const bodyTableOrders = document.querySelector(".body-table-orders");
const orderEmpty = document.querySelector(".order-empty");
const quantityBillElement = document.querySelector(".quantity_bill-number");

var listSP = getListSPFromLocalStorage();

var orderList = [];
const renderOrders = (result) => {
  console.log(result);
  if (result.errCode === 1) {
    ordersTable.classList.add("d-none");
    orderEmpty.classList.remove("d-none");
  } else {
    ordersTable.classList.remove("d-none");
    orderEmpty.classList.add("d-none");
    if (!result || !result.data) {
      return;
    }
    orderList = result.data;
    orderList.map((item) => {
      let trOrderElement = document.createElement("tr");
      trOrderElement.classList.add(`item-order-${item.inforsOrders.id}`);
      trOrderElement.innerHTML = `<td>
            <p>${item.inforsOrders.id}</p>
            <a href="/bills/detail" class="detail-order-${item.inforsOrders.id}" style="color: #2179da">
              Details <i class="fa-solid fa-caret-down"></i>
            </a>
          </td>
          <td>${item.nameCustomer}</td>
          <td>${item.inforsOrders.dateOrder}</td>
          <td>${item.inforsOrders.itemNumbers}</td>
          <td>${item.inforsOrders.totalQuantity}</td>
          <td>$ ${item.inforsOrders.totalPrice}</td>
          <td>
            <button
              class="btn-remove-order-${item.inforsOrders.id}"
              style="
                background-color: transparent;
                color: red;
                padding: 0 10px;
                font-size: 25px;
              "
            >
              <i class="fa-regular fa-rectangle-xmark"></i>
            </button>
          </td>`;
      bodyTableOrders.appendChild(trOrderElement);
    });
  }
};

const handleDeleteOrder = () => {
  if (orderList.length > 0) {
    orderList.map((order) => {
      let btnDeleteOrder = bodyTableOrders.querySelector(
        `.btn-remove-order-${order.inforsOrders.id}`
      );
      btnDeleteOrder.onclick = () => {
        deleteOrderAPI(order)
          .then((result) => {
            let trOrderElement = bodyTableOrders.querySelector(
              `.item-order-${order.inforsOrders.id}`
            );
            trOrderElement.remove();
            orderList = orderList.filter((item) => {
              return item.inforsOrders.id !== order.inforsOrders.id;
            });
            listSP = listSP.map((item) => {
              if (item.id === order.inforsOrders.idSP) {
                item.quantity += order.inforsOrders.itemNumbers;
              }
              return item;
            });
            saveListSPToLocalStorage(listSP);
            if (orderList.length === 0) {
              ordersTable.classList.add("d-none");
              quantityBillElement.innerText = ``;
              orderEmpty.classList.remove("d-none");
            } else {
              quantityBillElement.innerText = `(${orderList.length})`;
            }
          })
          .catch((err) => console.log(err));
      };
    });
  }
};

const handleViewDetailOrder = () => {
  if (orderList.length > 0) {
    orderList.map((order) => {
      console.log(order.inforsOrders.id);
      let btnViewDetailOrder = bodyTableOrders.querySelector(
        `.detail-order-${order.inforsOrders.id}`
      );
      console.log(btnViewDetailOrder);
      btnViewDetailOrder.onclick = (e) => {
        saveOrderDetailToLocalStorage(order);
      };
    });
  }
};

const updateQuantityBill = (result) => {
  const quantityBillElement = document.querySelector(".quantity_bill-number");
  if (result && result.data && result.data.length > 0) {
    quantityBillElement.innerText = `(${result.data.length})`;
  }
};

getOrdersAPI()
  .then((result) => {
    renderOrders(result);
    handleDeleteOrder();
    handleViewDetailOrder();
    updateQuantityBill(result);
  })
  .catch((err) => console.log(err));

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
