export const getCartItems = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  return cart ? cart : [];
};

export const clearCartItems = () => {
  localStorage.removeItem("cart");
};

export const addToCart = (car) => {
  const cart = getCartItems();
  const existing_car = cart.find((i) => i._id === car._id);
  if (existing_car) {
    existing_car.quantity++;
  } else {
    cart.push({
      ...car,
      quantity: 1,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeItemFromCart = (car_id) => {
  const cart = getCartItems();
  const deleteCart = cart.filter((c) => c._id !== car_id);

  localStorage.setItem("cart", JSON.stringify(deleteCart));
};

export const removeItemsFromCart = (list) => {
  const cart = getCartItems();
  const newCart = cart.filter((item) => {
    if (list.includes(item._id)) {
      return false;
    }
    return true;
  });
  localStorage.setItem("cart", JSON.stringify(newCart));
};
