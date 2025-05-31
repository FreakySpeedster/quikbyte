import { createContext, useContext, useReducer } from 'react';
import { CART_ACTIONS } from '../constants';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
        const itemToAdd = action.payload;
        const itemExists = state.some(item => item.id === itemToAdd.id);
        if (itemExists) {
            // If item exists, increase its quantity
            return state.map(item =>
            item.id === itemToAdd.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
        } else {
            // If item does not exist, add it with quantity 1
            return [...state, { ...itemToAdd, quantity: 1 }];
        }
    }

    case 'REMOVE_ITEM': {
      const { payload: itemId } = action;
      return state.filter(item => item.id !== itemId);
    }

    case 'REDUCE_QUANTITY': {
      const { payload: itemId } = action;
      const amount = 1;
      const itemToUpdate = state.find(item => item.id === itemId);
      if (!itemToUpdate) return state;
      if (itemToUpdate.quantity <= amount) {
        return state.filter(item => item.id !== itemId);
      }
      return state.map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - amount }
          : item
      );
    }
          
    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addItem = (item) => dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  const removeItem = (id) => dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: id });
  const reduceQuantity = (id) => dispatch({ type: CART_ACTIONS.REDUCE_QUANTITY, payload: id });
  const clearCart = () => dispatch({ type: CART_ACTIONS.CLEAR_CART });

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, reduceQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}