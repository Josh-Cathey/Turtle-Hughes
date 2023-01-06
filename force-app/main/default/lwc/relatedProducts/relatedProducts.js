import { LightningElement, wire, api, track } from "lwc";
 
//import { getRecord } from "lightning/uiRecordApi";
//import Products_ID from "@salesforce/schema/Product2.Product__c";
//import USER_ID from "@salesforce/user/Id";
import communityId from "@salesforce/community/Id";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//import ACCOUNT_ID from "@salesforce/schema/User.Contact.Account.Id";
 
import getCrossSellProducts from "@salesforce/apex/AdVic_RelatedProducts.getCrossSellProducts";
import addToCart from "@salesforce/apex/AdVic_RelatedProducts.addToCart";
import searchCurrentProductPageURL from "@salesforce/apex/AdVic_RelatedProducts.searchCurrentProductPageURL";
//import { resolve } from "c/cmsResourceResolver";
 
//import getRelatedProductInfo from "@salesforce/apex/AdVic_RelatedProducts.getRelatedIndividualProductInfo";
import { NavigationMixin } from "lightning/navigation";
 
// Provides the path prefix to Core resources - Use for Image URL
import { getPathPrefix } from "lightning/configProvider";
 
export default class relatedProducts extends NavigationMixin(LightningElement) {
 // @api filter;
 //const mycurrentproductID = this.findProductID();
 
 //https://success.salesforce.com/answers?id=906B0000000DWtiQAC
 
 /**
  * Gets or sers the effective account - if any - of the user viewing the product.
  *
  * @type {string}
  */
 @api effectiveAccountId;
 
 /**
  *  Gets or sets the unique identifier of a product.
  *
  * @type {string}
  */
 @api recordId;
 
 @track contactId;
 @track accountId;
 @track relatedProductUrl;
 //Store the webstoreID
 
 @track myCurrentProductPageURL;
 
 @track CSModifiedProducts;
 
 //Nb of items retrieves
 @track nbRecommendedItems;
 
 @track url;
 
 //store quantity for each elements
 @track qtyMap = new Map();
 
 /**
  * Gets the normalized effective account of the user.
  *
  * @type {string}
  * @readonly
  * @private
  */
 get resolvedEffectiveAccountId() {
   const effectiveAcocuntId = this.effectiveAccountId || "";
   let resolved = null;
 
   if (
     effectiveAcocuntId.length > 0 &&
     effectiveAcocuntId !== "000000000000000"
   ) {
     resolved = effectiveAcocuntId;
   }
   return resolved;
 }
 
 // Update Image URLs coming from CMS (URL or Uploaded images)
 resolve(url) {
   /**
    * Regular expressions for CMS resources and for static B2B image resources -
    * specifically the "no image" image - that we want to handle as though they were CMS resources.
    */
   const cmsResourceUrlPattern = /^\/cms\//;
   const b2bStaticImageResourcePattern = /^\/img\//;
   // If the URL is a CMS URL, transform it; otherwise, leave it alone.
   if (
     cmsResourceUrlPattern.test(url) ||
     b2bStaticImageResourcePattern.test(url)
   ) {
     url = `${getPathPrefix()}${url}`;
   }
 
   return url;
 }
 
 /**
  * Retrieve CrossSell Products on loading Page
  */
 connectedCallback() {
   this.nbRecommendedItems = 0;
   this.getCSProducts();
 }
 
 /**
  * Add Quantity in map for each products
  */
 handleQTYChange(event) {
   this.qtyMap.set(event.target.id, event.target.value);
   window.console.log(
     "event.target.id: ",
     event.target.id,
     " ",
     this.qtyMap.get(event.target.id)
   );
 }
 
 /**
  * Handles a user request to add the product to their active cart.
  *
  * @private
  */
 addProductToCart(evt) {
   console.log("add cart communityId", communityId);
   console.log(
     "add cart productId",
     evt.target.id.substring(0, evt.target.id.indexOf("-"))
   );
   console.log("add cart quantity", this.qtyMap.get(evt.target.id));
   console.log("add cart effectiveAccountId", this.resolvedEffectiveAccountId);
 
   addToCart({
     communityId: communityId,
     productId: evt.target.id.substring(0, evt.target.id.indexOf("-")),
     quantity: this.qtyMap.get(evt.target.id),
     effectiveAccountId: this.resolvedEffectiveAccountId
   })
     .then((result) => {
       console.log(result);
       console.log("no errors");
       this.dispatchEvent(
         new ShowToastEvent({
           title: "Cart Updated",
           message: "Product added to your cart",
           variant: "success"
         })
       );
 
       // document.querySelector("b2b_buyer_cart-badge").dispatchEvent(new CustomEvent("refresh"));
     })
     .catch((error) => {
       this.error = error;
       console.log("errors: " + JSON.stringify(error));
 
       this.dispatchEvent(
         new ShowToastEvent({
           title: "Error detected",
           message: error.message,
           variant: "error"
         })
       );
     });
 }
 
 /**
  * Access the Cross Sell Product on Click.
  */
  /**
  * Access the Cross Sell Product on Click.
  */
   handleClick(evt) {
     var ctarget = evt.currentTarget;
     var id = ctarget.dataset.value;
     this[NavigationMixin.Navigate]({
       type: 'standard__webPage',
       attributes: {
           url: 'https://turtlehughes--uat.sandbox.my.site.com/s/product/' + id,
           actionName: 'record'
       },
   });
  
  
 }
 
 
 //#################
 //##### NEW  ###### https://hicglobalsolutions.com/blog/lightning-web-components/
 //#################
 
 async getCSProducts() {
   let myCSProducts;
   let i;
   window.console.log("achabrol log: communityId: ", communityId);
   window.console.log("achabrol log: productID: ", this.recordId);
   window.console.log(
     "achabrol log: effectiveAccountID: ",
     this.effectiveAccountId
   );
   try {
     const myCrossSellProducts = await getCrossSellProducts({
       communityId: communityId,
       productID: this.recordId,
       effectiveAccountID: this.effectiveAccountId
     });
     //searchForProductMetadata(String cmsContentType, String cmsContentFieldName, String matchingRecord){
     //myContent = content;
     myCSProducts = JSON.parse(JSON.stringify(myCrossSellProducts));

     window.console.log("myCrossSellProducts:", myCSProducts);
     this.nbRecommendedItems = myCSProducts.length;
     const myCurrentProductPageURL = await searchCurrentProductPageURL();
 
     for (i = 0; i < myCSProducts.length; i++) {
       window.console.log("######## THE PRE ID: ");
       window.console.log("######## THE ID: ", myCSProducts[i].id);
       window.console.log("######## THE POST ID: ");
      
 
       //Get URL link to CrossSell Product
       myCSProducts[i].fullUrl = myCurrentProductPageURL + myCSProducts[i].id;
 
       //Get Unique Id for add to cart qty in case of two similar
       //myCSProducts[i].uniqueId = i + myCSProducts[i].id;
       //window.console.log("######## unique ID: ", myCSProducts[i].uniqueId);
 
       //Get Id of the
       myCSProducts[i].myId = myCSProducts[i].id;
       //window.console.log("######## My ID: ", myCSProducts[i].id);
       window.console.log("######## My ID: ", myCSProducts[i].myId);
 
       //  window.console.log("######## Final ID: ", myCSProducts[i].id);
 
     
       window.console.log("Name value: ", myCSProducts[i].fields.Name);
       //Get Price for this CrossSell Product
      
       window.console.log(
         "SKU value: ",
         myCSProducts[i].fields.StockKeepingUnit
       );


           window.console.log(
               "Image Alternative value: ",
               myCSProducts[i].defaultImage.alternativeText
           );
       
       //Get (and update) Description for this CrossSell Product
       if (myCSProducts[i].fields.Description != null) {
         //window.console.log('myDescription:', myContent[i].contentNodes.Description.value);
         myCSProducts[i].fields.Description = myCSProducts[
           i
         ].fields.Description.replace("&lt;p&gt;", "")
           .replace("&lt;/p&gt;", "")
           .replace("&#39;", "'")
           .replace("&lt;h1&gt;", "")
           .replace("&lt;/h1&gt;", "")
           .replace("&lt;br&gt;", "");
       }
       //Get Image for this CrossSell Product
             if (myCSProducts[i].defaultImage.url != null) {
                 window.console.log("URL value: ", myCSProducts[i].defaultImage.url);
                 myCSProducts[i].defaultImage.url = this.resolve(
                     myCSProducts[i].defaultImage.url
                 );
                 window.console.log("URL value: ", myCSProducts[i].defaultImage.url);
             }

     }
     // ### IMPORTANT REPLACE THE FOLLOWING LINE AND REMOVE AWAIT IN LOOP
     // Wait for every promise in the loop for getProductPrice
     //https://eslint.org/docs/rules/no-await-in-loop
     //this.CSModifiedProducts = await Promise.all(myCSProducts);
     this.CSModifiedProducts = myCSProducts;
   } catch (error) {
     window.console.log(error);
   }
 }
 
 /**
  * Gets whether product information has been retrieved for display.
  *
  * @type {Boolean}
  * @readonly
  * @private
  */
 get hasProducts() {
   return this.nbRecommendedItems !== 0;
 }
 
 //#################
 //##### NEW  ######
 //#################
}