const keyLocalStorageListSP = "DANHSACHSP";
const keyLocalStorageOrderDetail = "ORDERDETAIL";
const keyLocalStorageItemCart = "DANHSACHITEMCART";

export const saveListSPToLocalStorage = (data) => {
  if (data) {
    localStorage.setItem(keyLocalStorageListSP, JSON.stringify(data));
  }
};

export const getListSPFromLocalStorage = (function () {
  return () => {
    let data = JSON.parse(localStorage.getItem(keyLocalStorageListSP));
    if (data) {
      return data;
    } else return [];
  };
})();

export const saveListCartToLocalStorage = (data) => {
  if (data) {
    localStorage.setItem(keyLocalStorageItemCart, JSON.stringify(data));
  }
};

export const getListCartFromLocalStorage = (function () {
  return () => {
    let data = JSON.parse(localStorage.getItem(keyLocalStorageItemCart));
    if (data) {
      return data;
    } else return [];
  };
})();

export const saveOrderDetailToLocalStorage = (data) => {
  if (data) {
    localStorage.setItem(keyLocalStorageOrderDetail, JSON.stringify(data));
  }
};

export const getOrderDetailFromLocalStorage = (function () {
  return () => {
    let data = JSON.parse(localStorage.getItem(keyLocalStorageOrderDetail));
    if (data) {
      return data;
    } else return {};
  };
})();

export const getOrdersAPI = (function () {
  return async () => {
    let response = await fetch("http://localhost:3000/api/orders");
    let result = await response.json();
    return result;
  };
})();

export const createOrderAPI = async (data) => {
  let response = await fetch("http://localhost:3000/api/create-order", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    //make sure to serialize your JSON body
    body: JSON.stringify(data),
  });

  let result = await response.json();
  return result;
};

export const deleteOrderAPI = async (order) => {
  let response = await fetch(
    `http://localhost:3000/api/delete-order/${order.inforsOrders.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  let result = await response.json();
  return result;
};

export const getProvincesAPI = (function () {
  return async () => {
    let response = await fetch("https://provinces.open-api.vn/api/p/");
    let result = await response.json();
    return result;
  };
})();

export const getDistrictsAPI = (function () {
  return async () => {
    let response = await fetch("https://provinces.open-api.vn/api/d/");
    let result = await response.json();
    return result;
  };
})();

export const getWardsAPI = (function () {
  return async () => {
    let response = await fetch("https://provinces.open-api.vn/api/w/");
    let result = await response.json();
    return result;
  };
})();

export const sumArr = (arr, nameAttr) => {
  let sum = 0;
  if (!arr.find((item) => typeof item !== "number")) {
    sum = arr.reduce((acc, item) => {
      return acc + item;
    }, 0);
  } else if (!arr.find((item) => typeof item !== "object")) {
    sum = arr.reduce((acc, item) => {
      return acc + item[nameAttr];
    }, 0);
  }
  return sum;
};
