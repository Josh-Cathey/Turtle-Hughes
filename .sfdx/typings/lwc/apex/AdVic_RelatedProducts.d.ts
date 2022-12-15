declare module "@salesforce/apex/AdVic_RelatedProducts.getCrossSellProducts" {
  export default function getCrossSellProducts(param: {communityId: any, productID: any, effectiveAccountID: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_RelatedProducts.getProduct" {
  export default function getProduct(param: {webstoreId: any, productId: any, effectiveAccountId: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_RelatedProducts.searchCurrentProductPageURL" {
  export default function searchCurrentProductPageURL(): Promise<any>;
}
declare module "@salesforce/apex/AdVic_RelatedProducts.getProductPrice" {
  export default function getProductPrice(param: {communityId: any, productId: any, effectiveAccountId: any}): Promise<any>;
}
declare module "@salesforce/apex/AdVic_RelatedProducts.addToCart" {
  export default function addToCart(param: {communityId: any, productId: any, quantity: any, effectiveAccountId: any}): Promise<any>;
}
