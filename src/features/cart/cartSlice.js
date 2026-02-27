import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, fileTxtbk, txtbk, qty }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/cart', {lectureId: id, fileTxtbk, txtbk, qty});
      if(response.status !== 200){
        throw new Error(response.error);
      }

      dispatch(showToastMessage({message: '장바구니에 추가했습니다.', status: 'success'}));
      return response.data.cartItemQty;
    } catch (error) {
      dispatch(showToastMessage({message: error.message, status: 'error'}));
      return rejectWithValue(error.message);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/cart');
      if(response.status !==200) {
        throw new Error(response.error);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.delete(`/cart/${id}`);
      if(response.status !==200) {
        throw new Error(response.error);
      }
      dispatch(getCartList());
      return response.data.cartItemQty;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateItem = createAsyncThunk(
  "cart/updateItem",
  async ({ id, value, key }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${id}`, {value, key});
      if(response.status !== 200){
        throw new Error(response.error);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart/qty");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.qty;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    }
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
    .addCase(addToCart.pending, (state, action) => {
      state.loading = true;
    }).addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.cartItemCount = action.payload;
    }).addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }).addCase(getCartList.pending, (state, action) => {
      state.loading = true;
    }).addCase(getCartList.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.cartList = action.payload;
      state.totalPrice = action.payload.reduce((total, item) => total + (item.lectureId.dscnt ? item.lectureId.price * (1 - item.lectureId.dscntRt * 0.01) + item.lectureId.txtbkPrice[item.txtbk] * (item.qty - 1) : item.lectureId.price + item.lectureId.txtbkPrice[item.txtbk] * (item.qty - 1)), 0);
    }).addCase(getCartList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }).addCase(updateItem.pending, (state, action) => {
      state.loading = true;
    }).addCase(updateItem.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.cartList = action.payload;
      state.totalPrice = action.payload.reduce((total, item) => total + (item.lectureId.dscnt ? item.lectureId.price * (1 - item.lectureId.dscntRt * 0.01) + item.lectureId.txtbkPrice[item.txtbk] * (item.qty - 1) : item.lectureId.price + item.lectureId.txtbkPrice[item.txtbk] * (item.qty - 1)), 0);
    }).addCase(updateItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }).addCase(deleteCartItem.pending, (state, action) => {
      state.loading = true;
    }).addCase(deleteCartItem.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.cartItemCount = action.payload;
    }).addCase(deleteCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }).addCase(getCartQty.fulfilled, (state, action) => {
      state.cartItemCount = action.payload;
    }).addCase(getCartQty.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
