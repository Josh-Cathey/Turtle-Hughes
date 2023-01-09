import { api, LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';

import communityId from '@salesforce/community/Id';
import getCartSummary from '@salesforce/apex/B2BCartController.getCartSummary';
import getCartFields from '@salesforce/apex/B2BCartController.getCartFields';

import { registerListener, unregisterAllListeners } from 'c/pubsub';
// import { getLabelForOriginalPrice, displayOriginalPrice } from 'c/cartUtils';

const CART_ITEMS_UPDATED_EVT = 'cartitemsupdated';

export default class ProceedToCheckoutButton extends NavigationMixin(LightningElement) {

    @api
    recordId;

    @api isLoading = false;

    @api
    effectiveAccountId;

    @api
    buttonLabel;

    @api
    buttonColor;

    @api
    buttonTextColor;

    @wire(CurrentPageReference)
    pageRef;


    
    connectedCallback() {
        registerListener(
            CART_ITEMS_UPDATED_EVT,
            this.getUpdatedCartSummary,
            this
        );
       
        this.getUpdatedCartSummary();
    }

   
    disconnectedCallback() {
        unregisterAllListeners(this);
    }

 
 
   
    get resolvedEffectiveAccountId() {
        const effectiveAccountId = this.effectiveAccountId || '';
        let resolved = null;
        if (
            effectiveAccountId.length > 0 &&
            effectiveAccountId !== '000000000000000'
        ) {
            resolved = effectiveAccountId;
        }
        return resolved;
    }

    


    
    get information()  {
        return {
            shipmentMode: this.cartFields && this.cartFields.Shipment_Mode__c,
            overallWeight: this.cartFields && this.cartFields.Cart_Weight__c,
            estimatedSpace: this.cartFields && this.cartFields.Estimated_FT_Space__c,
            preventCheckout: this.cartFields && this.cartFields.Prevent_Checkout__c,
            invalidCart: this.cartFields && this.cartFields.Cart_Contains_Products_and_Samples__c,
            productsOnly: this.cartFields && this.cartFields.Cart_Contains_Products_ONLY__c
        };

    }   
    


 
    cartSummary;
    cartFields;

    

   
    getUpdatedCartSummary() {
        this.isLoading = true;
        getCartSummary({
            communityId: communityId,
            activeCartOrId: this.recordId,
            effectiveAccountId: this.resolvedEffectiveAccountId
        })
            .then((cartSummary) => {
                this.cartSummary = cartSummary;
                this.isLoading = false;
            })
            .catch((e) => {
                console.log(e);
            });

        getCartFields({
            activeCartOrId: this.recordId
        })
            .then((cartFields) => {
                this.cartFields = cartFields;
            })
            .catch((e) => {
                    // Handle cart summary error properly
                    // For this sample, we can just log the error
                console.log(e);
            });    
    }

    handleCheckoutClick() {
        // Navigate to a URL
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ecoreinternational--full.sandbox.my.site.com/shop/s/checkout/' + this.recordId
            }
        },
        true // Replaces the current page in your browser history with the URL
      );
    }
        
   
}