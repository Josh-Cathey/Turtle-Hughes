declare module "@salesforce/apex/B2BGetInfo.getProduct" {
  export default function getProduct(param: {communityId: any, productId: any, effectiveAccountId: any}): Promise<any>;
}
declare module "@salesforce/apex/B2BGetInfo.checkProductIsInStock" {
  export default function checkProductIsInStock(param: {productId: any}): Promise<any>;
}
declare module "@salesforce/apex/B2BGetInfo.getCartSummary" {
  export default function getCartSummary(param: {communityId: any, effectiveAccountId: any}): Promise<any>;
}
declare module "@salesforce/apex/B2BGetInfo.addToCart" {
  export default function addToCart(param: {communityId: any, productId: any, quantity: any, effectiveAccountId: any}): Promise<any>;
}
declare module "@salesforce/apex/B2BGetInfo.createAndAddToList" {
  export default function createAndAddToList(param: {communityId: any, productId: any, wishlistName: any, effectiveAccountId: any}): Promise<any>;
}
declare module "@salesforce/apex/B2BGetInfo.getProductPrice" {
  export default function getProductPrice(param: {communityId: any, productId: any, effectiveAccountId: any}): Promise<any>;
}
