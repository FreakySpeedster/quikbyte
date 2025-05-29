import { createContext, useContext, useReducer } from 'react';

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
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
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