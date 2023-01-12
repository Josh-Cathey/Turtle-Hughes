declare module "@salesforce/apex/AdVic_GuestCartController.getGuestCartItems" {
  export default function getGuestCartItems(param: {guestCartId: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_GuestCartController.retrieveUpdatedGuestCart" {
  export default function retrieveUpdatedGuestCart(param: {cartId: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_GuestCartController.updateGuestCartTotals" {
  export default function updateGuestCartTotals(param: {cartId: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_GuestCartController.updateGuestCartItemTotals" {
  export default function updateGuestCartItemTotals(param: {guestCartItemId: any, quantity: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_GuestCartController.adjustProductQuantity" {
  export default function adjustProductQuantity(param: {guestCartItemId: any, quantity: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_GuestCartController.addProductToCart" {
  export default function addProductToCart(param: {cartId: any, productId: any, quantity: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_GuestCartController.createCart" {
  export default function createCart(): Promise<any>;
}
declare module "@salesforce/apex/AdVic_GuestCartController.deleteGuestCartItem" {
  export default function deleteGuestCartItem(param: {itemId: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_GuestCartController.deleteGuestCart" {
  export default function deleteGuestCart(param: {guestCartId: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_GuestCartController.sortGuestCartItems" {
  export default function sortGuestCartItems(param: {guestCartId: any, sortOrder: any}): Promise<any>;
}
