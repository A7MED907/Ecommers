// ================ Shopping Cart Component ================

import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Badge } from '../ui/badge';
import type { CartItem } from '../../types/models';
import './ShoppingCart.css';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  total: number;
}

export function ShoppingCart({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  total,
}: ShoppingCartProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="cart-content">
        <SheetHeader>
          <SheetTitle className="cart-header">
            Shopping Cart
            <Badge variant="secondary">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-content">
                <p>Your cart is empty</p>
                <Button onClick={onClose} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* ================ Cart Items ================ */}
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.product.id} className="cart-item">
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="cart-item-image"
                    />
                    
                    <div className="cart-item-details">
                      <h4 className="cart-item-title">{item.product.title}</h4>
                      <p className="cart-item-price">
                        ${item.price.toFixed(2)} each
                      </p>
                      
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.product.id, item.count - 1)}
                            className="quantity-btn"
                          >
                            <Minus className="icon" />
                          </Button>
                          
                          <span className="quantity-value">{item.count}</span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.product.id, item.count + 1)}
                            className="quantity-btn"
                          >
                            <Plus className="icon" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="remove-btn"
                        >
                          <Trash2 className="icon" />
                        </Button>
                      </div>
                      
                      <p className="cart-item-subtotal">
                        Subtotal: ${(item.price * item.count).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ================ Cart Footer ================ */}
              <div className="cart-footer">
                <div className="cart-total">
                  <span className="total-label">Total:</span>
                  <span className="total-value">${total.toFixed(2)}</span>
                </div>
                
                <div className="cart-actions">
                  <Button className="checkout-btn" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" className="continue-btn" onClick={onClose}>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
