declare module "@salesforce/apex/B2BCartController.getCartItems" {
  export default function getCartItems(param: {communityId: any, effectiveAccountId: any, activeCartOrId: any, pageParam: any, sortParam: any}): Promise<any>;
}
declare module "@salesforce/apex/B2BCartController.updateCartItem" {
  export default function updateCartItem(param: {communityId: any, effectiveAccountId: any, activeCartOrId: any, cartItemId: any, cartItem: any}): Promise<any>;
}
declare module "@salesforce/apex/B2BCartController.deleteCartItem" {
  export default function deleteCartItem(param: {communityId: any, effectiveAccountId: any, activeCartOrId: any, cartItemId: any}): Promise<any>;
}
declare module "@salesforce/apex/B2BCartController.getCartSummary" {
  export default function getCartSummary(param: {communityId: any, effectiveAccountId: any, activeCartOrId: any}): Promise<any>;
}
declare module "@salesforce/apex/B2BCartController.createCart" {
  export default function createCart(param: {communityId: any, effectiveAccountId: any}): Promise<any>;
}
declare module "@salesforce/apex/B2BCartController.deleteCart" {
  export default function deleteCart(param: {communityId: any, effectiveAccountId: any, activeCartOrId: any}): Promise<any>;
}
