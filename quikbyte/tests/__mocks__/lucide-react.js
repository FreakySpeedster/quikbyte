// Mock for lucide-react icons
const MockIcon = ({ size, ...props }) => {
  return <span data-testid="mock-icon" {...props}></span>;
};

// Export all icons used in the project
export const ShoppingCart = MockIcon;
export const Plus = MockIcon;
export const Minus = MockIcon;
export const X = MockIcon;
export const Check = MockIcon;
