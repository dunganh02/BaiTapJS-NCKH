import {
  saveListSPToLocalStorage,
  getListSPFromLocalStorage,
  getListCartFromLocalStorage,
  saveListCartToLocalStorage,
  createOrderAPI,
  getOrdersAPI,
  getProvincesAPI,
  getDistrictsAPI,
  getWardsAPI,
  sumArr,
} from "../utils/index.js";

const tableCart = document.querySelector(".cart_content-table-cart");
const bodyTableCart = document.querySelector(".body-form-cart");

const textTotal = document.querySelector(".content_cart-total");

const inputFirstName = document.querySelector(".input-firstname-customer");
const inputLastName = document.querySelector(".input-lastname-customer");
const inputEmail = document.querySelector(".input-email-customer");
const inputPhoneNumber = document.querySelector(".input-phone-number-customer");
const selectProvincesElement = document.querySelector(".select-provinces");
const selectDistrictsElement = document.querySelector(".select-districts");
const selectWardsElement = document.querySelector(".select-wards");

const fieldFirstName = document.querySelector(".field-firstname");
const fieldLastName = document.querySelector(".field-lastname");
const fieldEmail = document.querySelector(".field-email");
const fieldPhoneNumber = document.querySelector(".field-phonenumber");
const fieldAddress = document.querySelector(".field-address");

const btnBuy = document.querySelector(".btn-buy");
const btnCloseFormCustomer = document.querySelector(
  ".icon-close-form-customer"
);
const btnCancelSubmitForm = document.querySelector(".btn-cancel-customer-form");
const btnSubmitFormCustomer = document.querySelector(
  ".btn-submit-customer-form"
);
const formCustomerWrap = document.querySelector(".form_customer-wrap");

const cartEmpty = document.querySelector(".cart-empty");

// const keyLocalStorageListSP = "DANHSACHSP";
// const keyLocalStorageItemCart = "DANHSACHITEMCART";
// const keyLocalStorageItemOrder = "DANHSACHITEMORDER";

var listCart = getListCartFromLocalStorage();
var listSP = getListSPFromLocalStorage();

var idSPInCart = [];
const getIdSPInCart = () => {
  if (listCart) {
    idSPInCart = listCart.map((item) => item.idSP);
  }
};

var IdOrders = [];
const randomIdOrder = () => {
  let idOrder = 0;
  let checkIdOrder = false;
  do {
    idOrder = Math.floor(Math.random() * 1000);
    checkIdOrder = IdOrders.includes(idOrder);
  } while (checkIdOrder);
  IdOrders.push(idOrder);
  return idOrder;
};

const customNotifyText = (element, type) => {
  if (element.querySelector(`.err-is-${type}`)) {
    return;
  }
  let errText = document.createElement("p");
  errText.className = `err-is-${type}`;

  switch (type) {
    case "empty":
      errText.innerHTML = "Bạn không được bỏ trống!";
      break;
    case "invalid-email":
      errText.innerHTML = "Email không đúng định dạng!";
      break;
    default:
      errText.innerHTML = "Something wrong!";
  }
  Object.assign(errText.style, {
    color: "red",
    fontSize: "14px",
    textAlign: "left",
    marginTop: "3px",
    display: "block",
  });
  element.appendChild(errText);
};

const removeNotifyText = (element, type) => {
  let errText = element.querySelector(`.err-is-${type}`);
  if (errText) {
    errText.remove();
  }
};

btnBuy.onclick = () => {
  if (listCart.length > 0) {
    formCustomerWrap.classList.remove("d-none");
  }
};
btnCloseFormCustomer.onclick = () => {
  formCustomerWrap.classList.add("d-none");
};
btnCancelSubmitForm.onclick = () => {
  formCustomerWrap.classList.add("d-none");
};

var createOrder = (data) => {
  createOrderAPI(data)
    .then((result) => {
      if (result.errCode === 0) {
        console.log("Tạo hóa đơn đặt hàng sản phẩm thành công");
      } else {
        alert("Có lỗi xảy ra!!!");
      }
    })
    .catch((err) => console.log(err));
};

var orders = [];
getOrdersAPI()
  .then((result) => {
    if (result.errCode !== 1) {
      orders = result.data;
      updateQuantityBill(orders);
      console.log(result);
    }
    return;
  })
  .catch((err) => console.log(err));

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

btnSubmitFormCustomer.onclick = () => {
  let isEmpty = false;
  if (inputFirstName.value.trim() === "") {
    customNotifyText(fieldFirstName, "empty");
    isEmpty = true;
  }
  if (inputLastName.value.trim() === "") {
    customNotifyText(fieldLastName, "empty");
    isEmpty = true;
  }
  if (inputEmail.value.trim() === "") {
    customNotifyText(fieldEmail, "empty");
    isEmpty = true;
  }
  if (inputPhoneNumber.value.trim() === "") {
    customNotifyText(fieldPhoneNumber, "empty");
    isEmpty = true;
  }
  if (
    selectProvincesElement.value === "" ||
    selectDistrictsElement.value === "" ||
    selectWardsElement.value === ""
  ) {
    customNotifyText(fieldAddress, "empty");
    isEmpty = true;
  }
  if (!isEmpty) {
    if (validateEmail(inputEmail.value.trim()) === false) {
      customNotifyText(fieldEmail, "invalid-email");
      return;
    }
    let nameCustomer = inputFirstName.value + " " + inputLastName.value;
    let province = provinces.find(
      (item) => item.code === +selectProvincesElement.value
    ).name;
    let district = districts.find(
      (item) => item.code === +selectDistrictsElement.value
    ).name;
    let ward = wards.find(
      (item) => item.code === +selectWardsElement.value
    ).name;

    let addressCustomer = province + ", " + district + ", " + ward;
    let currentDate = new Date();
    let dateOrder =
      currentDate.getMonth() +
      1 +
      "/" +
      currentDate.getDate() +
      "/" +
      currentDate.getFullYear();

    inforsProductCart.map((item) => {
      console.log(item);
      let itemCartElement = document.querySelector(`.item-cart-${item.id}`);
      itemCartElement.remove();

      if (item.quantity === 0) {
        alert(`${item.name} đã hết sản phẩm!!!`);
      } else if (item.quantityCart > item.quantity) {
        alert(`${item.name} chỉ có ${item.quantity} sản phẩm!`);
      } else {
        let idOrder = randomIdOrder();
        let order = {
          nameCustomer,
          addressCustomer,
          inforsOrders: {
            id: idOrder,
            idSP: item.id,
            dateOrder,
            itemNumbers: item.quantityCart,
            totalQuantity: item.quantity,
            totalPrice: item.total,
          },
        };

        listCart = listCart.filter((itemInCart) => {
          return itemInCart.idSP !== item.id;
        });

        listSP = listSP.map((itemInListSP) => {
          if (+itemInListSP.id === +item.id) {
            itemInListSP.quantity -= item.quantityCart;
          }
          return itemInListSP;
        });
        orders = [...orders, order];

        createOrder(order);
      }
    });
    saveListCartToLocalStorage(listCart);
    updateQuantityCart();
    saveListSPToLocalStorage(listSP);
    renderCart();
    if (sumArr(inforsProductCart, "total") === 0) {
      textTotal.innerHTML = "";
      cartEmpty.innerText = "Đặt hàng thành công";
    } else {
      textTotal.innerHTML = `Total: $${sumArr(
        inforsProductCart,
        "total"
      ).toLocaleString("en-US")}`;
    }
    updateQuantityBill(orders);
    formCustomerWrap.classList.add("d-none");
  }
};

inputFirstName.oninput = () => {
  removeNotifyText(fieldFirstName, "empty");
};

inputLastName.oninput = () => {
  removeNotifyText(fieldLastName, "empty");
};

inputEmail.oninput = () => {
  removeNotifyText(fieldEmail, "empty");
  removeNotifyText(fieldEmail, "invalid-email");
};

inputPhoneNumber.oninput = () => {
  removeNotifyText(fieldPhoneNumber, "empty");
};

selectWardsElement.onchange = () => {
  removeNotifyText(fieldAddress, "empty");
};

var provinces = [];
const getProvinces = () => {
  getProvincesAPI()
    .then((result) => {
      provinces = result;
      if (provinces.length > 0) {
        provinces.map((item) => {
          let optionProvinceElement = document.createElement("option");
          optionProvinceElement.value = item.code;
          optionProvinceElement.innerText = item.name;
          selectProvincesElement.appendChild(optionProvinceElement);
        });
      }
    })
    .catch((error) => console.log(error));
};
getProvinces();

var districts = [];
const getDistricts = () => {
  console.log(selectProvincesElement.value);
  if (provinces.length > 0 && selectProvincesElement.value) {
    getDistrictsAPI()
      .then((result) => {
        let listDistrictBaseOnProvince = result.filter((item) => {
          return +item.province_code === +selectProvincesElement.value;
        });
        districts = listDistrictBaseOnProvince;
        districts.map((item) => {
          let optionDistrictElement = document.createElement("option");
          optionDistrictElement.value = item.code;
          optionDistrictElement.innerText = item.name;
          selectDistrictsElement.appendChild(optionDistrictElement);
        });
      })
      .catch((error) => console.log(error));
  }
};

var wards = [];
const getWards = () => {
  if (
    provinces.length > 0 &&
    districts.length > 0 &&
    selectDistrictsElement.value
  ) {
    getWardsAPI()
      .then((result) => {
        let wardsBaseOnDistrict = result.filter(
          (item) => +item.district_code === +selectDistrictsElement.value
        );
        wards = wardsBaseOnDistrict;
        wards.map((item) => {
          let optionWardElement = document.createElement("option");
          optionWardElement.value = item.code;
          optionWardElement.innerText = item.name;
          selectWardsElement.appendChild(optionWardElement);
        });
      })
      .catch((error) => console.log(error));
  }
};

const resetAddressDistricts = () => {
  selectDistrictsElement.innerHTML =
    "<option selected value=''>--Chọn Huyện/Quận--</option> ";
};
const resetAddressWards = () => {
  selectWardsElement.innerHTML =
    "<option selected value=''>--Chọn Phường/Xã--</option>";
};

selectProvincesElement.onchange = () => {
  resetAddressDistricts();
  resetAddressWards();
  getDistricts();
};

selectDistrictsElement.onchange = () => {
  resetAddressWards();
  getWards();
};

const removeItemCartHTML = (idItemDelete) => {
  let itemDelete = bodyTableCart.querySelector(`.item-cart-${idItemDelete}`);
  itemDelete.remove();
};

var inforsProductCart = [];
const renderCart = () => {
  getIdSPInCart();
  if (idSPInCart.length === 0) {
    cartEmpty.classList.remove("d-none");
    tableCart.classList.add("d-none");
    btnBuy.classList.add("d-none");
    inforsProductCart = [];
  } else if (listSP) {
    tableCart.classList.remove("d-none");
    btnBuy.classList.remove("d-none");
    cartEmpty.classList.add("d-none");
    inforsProductCart = listSP.filter((item) => {
      if (idSPInCart.includes(item.id)) {
        item.quantityCart = listCart.find(
          (itemCart) => itemCart.idSP === item.id
        ).soLuong;
        item.total = item.quantityCart * item.price;
      }
      return idSPInCart.includes(item.id);
    });
    inforsProductCart.map((item) => {
      let trElementSP = document.createElement("tr");
      trElementSP.classList.add(`item-cart-${item.id}`);
      trElementSP.innerHTML = `<th class="d-flex">
        <img
          class="cart_content-image-product"
          src=${item.image}
          href="logo product"
        />
        <div class="cart_content-infors-product">
          <p class="cart_content-name-product">${item.name}</p>
          <p class="cart_content-quantity-product">Quantity:${item.quantity}</p>
        </div>
      </th>
      <td class="position-relative">
        <div
          class="col-quantity position-absolute top-50 start-50 translate-middle"
        >
          <button class='btn-decrease-quantity-${
            item.id
          }'>-</button> <span class="quantity-item-in-cart-${item.id}">${
        item.quantityCart
      }</span> <button class='btn-increase-quantity-${item.id}''>+</button>
        </div>
      </td>
      <td class="position-relative">
        <p
          class="col-subtotal position-absolute top-50 start-50 translate-middle"
        >
          $ ${item.price.toLocaleString("en-US")}
        </p>
      </td>
      <td class="position-relative">
        <p
          class="total-price-item-${
            item.id
          } col-total position-absolute top-50 start-50 translate-middle"
        >
          $ ${item.total.toLocaleString("en-US")}
        </p>
      </td>
      <td class="position-relative">
        <i
          class="col-btn-clear-cart btn-clear-cart-${
            item.id
          } fa-regular fa-circle-xmark"
        ></i>
      </td>`;
      bodyTableCart.appendChild(trElementSP);
    });
    textTotal.innerText = `Total: $${sumArr(
      inforsProductCart,
      "total"
    ).toLocaleString("en-US")}`;
  }
  listCart.map((item) => {
    let btnClearCart = bodyTableCart.querySelector(
      `.btn-clear-cart-${item.idSP}`
    );
    btnClearCart.onclick = () => {
      listCart = listCart.filter((itemInListCart) => {
        return itemInListCart.idSP !== item.idSP;
      });
      removeItemCartHTML(item.idSP);
      saveListCartToLocalStorage(listCart);
      inforsProductCart = inforsProductCart.filter(
        (itemInforsProductCart) => itemInforsProductCart.id !== item.idSP
      );
      updateQuantityCart();
      textTotal.innerText = `Total: $${sumArr(
        inforsProductCart,
        "total"
      ).toLocaleString("en-US")}`;
      getIdSPInCart();
      if (idSPInCart.length === 0) {
        cartEmpty.classList.remove("d-none");
        tableCart.classList.add("d-none");
        btnBuy.classList.add("d-none");
        inforsProductCart = [];
        textTotal.innerText = ``;
      }
    };

    let btnIncreaseQuantity = bodyTableCart.querySelector(
      `.btn-increase-quantity-${item.idSP}`
    );
    btnIncreaseQuantity.onclick = () => {
      inforsProductCart = inforsProductCart.map((itemInforsProductCart) => {
        if (itemInforsProductCart.id === item.idSP) {
          itemInforsProductCart.quantityCart++;
          itemInforsProductCart.total =
            itemInforsProductCart.quantityCart * itemInforsProductCart.price;

          let quantityItem = bodyTableCart.querySelector(
            `.quantity-item-in-cart-${item.idSP}`
          );
          let totalPriceItemCart = bodyTableCart.querySelector(
            `.total-price-item-${item.idSP}`
          );

          quantityItem.innerText = itemInforsProductCart.quantityCart;
          totalPriceItemCart.innerText = `$ ${(
            itemInforsProductCart.quantityCart * itemInforsProductCart.price
          ).toLocaleString("en-US")}`;
        }
        return itemInforsProductCart;
      });
      textTotal.innerText = `Total: $${sumArr(
        inforsProductCart,
        "total"
      ).toLocaleString("en-US")}`;
      listCart = listCart.map((itemInListCart) => {
        if (itemInListCart.idSP === item.idSP) {
          itemInListCart.soLuong++;
        }
        return itemInListCart;
      });
      console.log(inforsProductCart);
      saveListCartToLocalStorage(listCart);
    };
    let btnDecreaseQuantity = bodyTableCart.querySelector(
      `.btn-decrease-quantity-${item.idSP}`
    );
    btnDecreaseQuantity.onclick = () => {
      inforsProductCart = inforsProductCart.map((itemInforsProductCart) => {
        if (itemInforsProductCart.id === item.idSP) {
          if (itemInforsProductCart.quantityCart !== 1) {
            itemInforsProductCart.quantityCart--;
            itemInforsProductCart.total =
              itemInforsProductCart.quantityCart * itemInforsProductCart.price;
          }
          let quantityItem = bodyTableCart.querySelector(
            `.quantity-item-in-cart-${item.idSP}`
          );
          let totalPriceItemCart = bodyTableCart.querySelector(
            `.total-price-item-${item.idSP}`
          );
          quantityItem.innerText = itemInforsProductCart.quantityCart;
          totalPriceItemCart.innerText = `$ ${itemInforsProductCart.total.toLocaleString(
            "en-US"
          )}`;
        }
        return itemInforsProductCart;
      });
      listCart = listCart.map((itemInListCart) => {
        if (itemInListCart.idSP === item.idSP) {
          if (itemInListCart.soLuong !== 1) {
            itemInListCart.soLuong--;
          }
        }
        return itemInListCart;
      });
      textTotal.innerText = `Total: $${sumArr(
        inforsProductCart,
        "total"
      ).toLocaleString("en-US")}`;
      console.log(inforsProductCart);
      saveListCartToLocalStorage(listCart);
    };
  });
};
renderCart();

const updateQuantityBill = (orders) => {
  const quantityBillElement = document.querySelector(".quantity_bill-number");
  if (orders && orders.length > 0) {
    quantityBillElement.innerText = `(${orders.length})`;
  } else {
    quantityBillElement.innerText = ``;
  }
};

const updateQuantityCart = () => {
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
