declare module "@salesforce/apex/AdVic_GuestCartController.retrieveGuestCartItems" {
  export default function retrieveGuestCartItems(param: {guestCartId: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_GuestCartController.retrieveUpdatedGuestCart" {
  export default function retrieveUpdatedGuestCart(param: {cartId: any}): Promise<any>;
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
