import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isGuest from '@salesforce/user/isGuest';
import communityBasePath from '@salesforce/community/basePath';
import createCart from '@salesforce/apex/AdVic_GuestCartController.createCart';
import addProductToCart from '@salesforce/apex/AdVic_GuestCartController.addProductToCart';
import adjustProductQuantity from '@salesforce/apex/AdVic_GuestCartController.adjustProductQuantity';
import retrieveUpdatedGuestCart from '@salesforce/apex/AdVic_GuestCartController.retrieveUpdatedGuestCart';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { publish, MessageContext } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/MyMessageChannel__c";

// A fixed entry for the home page.
const homePage = {
    name: 'Home',
    type: 'standard__namedPage',
    attributes: {
        pageName: 'home'
    }
};

/**
 * An organized display of product information.
 *
 * @fires ProductDetailsDisplay#addtocart
 * @fires ProductDetailsDisplay#createandaddtolist
 */
export default class ProductDetailsDisplay extends NavigationMixin(LightningElement) {
    @track promptGuestToSignIn = false;
    @track createAccountUrl;
    @track checkoutAsGuest = false;
    @track products = [];
    @track cart;
    @track cartConfig;
    @track decrementButtonDisabled = true;
    
    /**
     * Gets or sets the unique identifier of a product.
     *
     * @type {string}
     */
    @api
    recordId;


    /**
     * An event fired when the user indicates the product should be added to their cart.
     *
     * Properties:
     *   - Bubbles: false
     *   - Composed: false
     *   - Cancelable: false
     *
     * @event ProductDetailsDisplay#addtocart
     * @type {CustomEvent}
     *
     * @property {string} detail.quantity
     *  The number of items to add to cart.
     *
     * @export
     */

    /**
     * An event fired when the user indicates the product should be added to a new wishlist
     *
     * Properties:
     *   - Bubbles: false
     *   - Composed: false
     *   - Cancelable: false
     *
     * @event ProductDetailsDisplay#createandaddtolist
     * @type {CustomEvent}
     *
     * @export
     */

    /**
     * A product image.
     * @typedef {object} Image
     *
     * @property {string} url
     *  The URL of an image.
     *
     * @property {string} alternativeText
     *  The alternative display text of the image.
     */

    /**
     * A product category.
     * @typedef {object} Category
     *
     * @property {string} id
     *  The unique identifier of a category.
     *
     * @property {string} name
     *  The localized display name of a category.
     */

    /**
     * A product price.
     * @typedef {object} Price
     *
     * @property {string} negotiated
     *  The negotiated price of a product.
     *
     * @property {string} currency
     *  The ISO 4217 currency code of the price.
     */

    /**
     * A product field.
     * @typedef {object} CustomField
     *
     * @property {string} name
     *  The name of the custom field.
     *
     * @property {string} value
     *  The value of the custom field.
     */

    /**
     * An iterable Field for display.
     * @typedef {CustomField} IterableField
     *
     * @property {number} id
     *  A unique identifier for the field.
     */

    /**
     * Gets or sets which custom fields should be displayed (if supplied).
     *
     * @type {CustomField[]}
     */
    @api
    customFields;

    /**
     * Gets or sets whether the cart is locked
     *
     * @type {boolean}
     */
    @api
    cartLocked;

    /**
     * Gets or sets the name of the product.
     *
     * @type {string}
     */
    @api
    description;

    /**
     * Gets or sets the product image.
     *
     * @type {Image}
     */
    @api
    image;

    /**
     * Gets or sets whether the product is "in stock."
     *
     * @type {boolean}
     */
    @api
    inStock = false;

    /**
     * Gets or sets the name of the product.
     *
     * @type {string}
     */
    @api
    name;

    /**
     * Gets or sets the price - if known - of the product.
     * If this property is specified as undefined, the price is shown as being unavailable.
     *
     * @type {Price}
     */
    @api
    price;

    /**
     * Gets or sets teh stock keeping unit (or SKU) of the product.
     *
     * @type {string}
     */
    @api
    sku;

    _invalidQuantity = false;
    _quantityFieldValue = 1;
    _categoryPath;
    _resolvedCategoryPath = [];

    // A bit of coordination logic so that we can resolve product URLs after the component is connected to the DOM,
    // which the NavigationMixin implicitly requires to function properly.
    _resolveConnected;
    _connected = new Promise((resolve) => {
        this._resolveConnected = resolve;
    });

    connectedCallback() {
        console.log('productDetailsDisplay.js: this.recordId (Id of the product) = ' + this.recordId);
        if (this.cartConfig == null && isGuest) {
            this.getCartFromLocalStorage();
            console.log('Inside ConnectedCallback(): cartConfig');
            //console.log(JSON.parse(JSON.stringify(this.cartConfig)));

            //console.log('Inside ConnectedCallback(): cart');
            //console.log(JSON.parse(JSON.stringify(this.cart)));

          //  console.log('Inside ConnectedCallback(): products');
           // console.log(JSON.parse(JSON.stringify(this.products)));
        }




        //this.recordId = this.recordId != null ? this.recordId : '01t7c00000748qsAAA'; // recordId is currently returning as undefined...
        this._resolveConnected();
    }

    disconnectedCallback() {
        this._connected = new Promise((resolve) => {
            this._resolveConnected = resolve;
        });
    }

    /**
     * Gets or sets the ordered hierarchy of categories to which the product belongs, ordered from least to most specific.
     *
     * @type {Category[]}
     */
    @api
    get categoryPath() {
        return this._categoryPath;
    }

    set categoryPath(newPath) {
        this._categoryPath = newPath;
        this.resolveCategoryPath(newPath || []);
    }

    get hasPrice() {
        return ((this.price || {}).negotiated || '').length > 0;
    }

    /**
     * Gets whether add to cart button should be displabled
     *
     * Add to cart button should be disabled if quantity is invalid,
     * if the cart is locked, or if the product is not in stock
     */
    get _isAddToCartDisabled() {
        //return this._invalidQuantity || this.cartLocked || !this.inStock;

        // ONLY FOR TESTING: Currently returning false so button is never disabled, even when product is out of stock
        return false;
    }

    handleQuantityChange(event) {
        if (event.target.validity.valid && event.target.value) {
            this._invalidQuantity = false;
            this._quantityFieldValue = event.target.value;
        } else {
            this._invalidQuantity = true;
        }
    }

    /**
     * Emits a notification that the user wants to add the item to their cart.
     *
     * @fires ProductDetailsDisplay#addtocart
     * @private
     */
    notifyAddToCart() {
        if (!isGuest) {
            let quantity = this._quantityFieldValue;
            this.dispatchEvent(
                new CustomEvent('addtocart', {
                    detail: {
                        quantity
                    }
                })
            );
        }
        else if (isGuest && this.cartConfig != null) {
            console.log('check 1');
            this.addItemToGuestCart();
        }
        else if (isGuest && this.cartConfig == null) {
            console.log('check 2');
            this.getCartFromLocalStorage();
            this.promptGuestToSignIn = true;
        }
    }

    /**
     * Emits a notification that the user wants to add the item to a new wishlist.
     *
     * @fires ProductDetailsDisplay#createandaddtolist
     * @private
     */
    notifyCreateAndAddToList() {
        this.dispatchEvent(new CustomEvent('createandaddtolist'));
    }

    /**
     * Updates the breadcrumb path for the product, resolving the categories to URLs for use as breadcrumbs.
     *
     * @param {Category[]} newPath
     *  The new category "path" for the product.
     */
    resolveCategoryPath(newPath) {
        const path = [homePage].concat(
            newPath.map((level) => ({
                name: level.name,
                //name: this.escapeHtml(level.name),
                //name: level.name.text(),
                type: 'standard__recordPage',
                attributes: {
                    actionName: 'view',
                    recordId: level.id
                }
            }))
        );

        this._connected
            .then(() => {
                const levelsResolved = path.map((level) =>
                    this[NavigationMixin.GenerateUrl]({
                        type: level.type,
                        attributes: level.attributes
                    }).then((url) => ({
                        name: level.name,
                        url: url
                    }))
                );

                return Promise.all(levelsResolved);
            })
            .then((levels) => {
                this._resolvedCategoryPath = levels;
            });
    }

    /**
     * Gets the iterable fields.
     *
     * @returns {IterableField[]}
     *  The ordered sequence of fields for display.
     *
     * @private
     */
    get _displayableFields() {
        // Enhance the fields with a synthetic ID for iteration.
        return (this.customFields || []).map((field, index) => ({
            ...field,
            id: index
        }));
    }

    guestBrowsingLogin() {
        this[NavigationMixin.Navigate]({
            type: 'comm__loginPage',
            attributes: {
                actionName: 'login'
            }
        });
    }
    
    guestBrowsingCreateAccount() {
        this[NavigationMixin.GenerateUrl]({
            type: "standard__webPage",
            attributes: {
                url: communityBasePath + "/login/SelfRegister"
            },
        }).then((generatedUrl) => { 
            this.createAccountUrl = generatedUrl;
        });
    }

    closeModal() {
        this.promptGuestToSignIn = false;
    }

    continueAsGuest() {
        this.checkoutAsGuest = true;
        this.promptGuestToSignIn = false;

        this.initGuestCart();
    }

    initGuestCart() {
        createCart({})
            .then((data) => {
                this.cart = data;
                this.addItemToGuestCart();
            })
            .catch(error => { console.error('Error creating guest cart -> ' + error); })
    }

    addItemToGuestCart() {
        console.log(' check 3 ');
        var foundMatchingItem = false;
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].Product__c === this.recordId) {
                foundMatchingItem = true;

                // TESTING
                console.log('Attempting to add ' + this._quantityFieldValue + ' to productId ' + this.products[i].Product__c);

                // if found, increment the quantity on the product
                // update the guest cart item record in apex
                // then return the item, and update the item in the array
                adjustProductQuantity({guestCartItemId: this.products[i].Id, quantity: this._quantityFieldValue})
                    .then((data) => {
                        this.products[i] = data;
                        this.updateCart();
                        console.log(' check 4 ');
                        this.setCartToLocalStorage();
                        // window.location.reload();

                        // Display a popup so the user knows the product has been added to their cart
                        this.showAddToCartNotification();
                    })
                    .catch(error => { console.error('Error adjusting quantity for guest cart item -> ' + error); })

                // if a record is found, break out of the loop
                break;
            }
        }

        if (!foundMatchingItem) {
            addProductToCart({cartId: this.cart.Id, productId: this.recordId, quantity: this._quantityFieldValue})
                .then((data) => {
                    this.products.push(data);
                    this.updateCart();
                    this.setCartToLocalStorage();
                    //   eval("$A.get('e.force:refreshView').fire();");
                    // window.location.reload();
                    publish(this.messageContext, SAMPLEMC, undefined);       

                    // Display a popup so the user knows the product has been added to their cart
                    this.showAddToCartNotification();

                })
                .catch(error => { console.error('Error creating guest cart item -> ' + error); })
        }
    }
    @wire(MessageContext)
    messageContext;

    updateCart() {
        retrieveUpdatedGuestCart({cartId: this.cart.Id})
            .then((data) => {
                 console.log('Calling retrieveUpdatedGuestCart');
                 console.log('test 01.1 = ',data);
                this.cart = data;
            })
            .catch(error => { console.error('Error calling AdVic_GuestCartController.retrieveUpdatedGuestCart() -> ' + error); })
    }

    setCartToLocalStorage() {
        var cartDetail = {
            cart: this.cart,
            products: this.products
        };

        this.cartConfig = cartDetail;

        localStorage.setItem('cart', JSON.stringify(cartDetail));
    }

    getCartFromLocalStorage() {
        this.cartConfig = JSON.parse(localStorage.getItem('cart'));
        if (this.cartConfig != null) {
            this.products = this.cartConfig.products;
            this.cart = this.cartConfig.cart;
        }
    }

    showAddToCartNotification() {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Your cart has been updated.',
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }

    escapeHtml(text) {
        var map = {
            '&amp;': '&#38;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        console.log('text = ' + text);
        console.log('escapeHtml text = ' + text.replace(/[&<>"']/g, function(m) { return map[m]; }));
        
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    incrementQuantity() {
        this._quantityFieldValue += 1;
        this.decrementButtonDisabled = false;
    }

    decrementQuantity() {
        this._quantityFieldValue = this._quantityFieldValue > 1 ? this._quantityFieldValue -= 1 : this._quantityFieldValue;
        this.decrementButtonDisabled = this._quantityFieldValue === 1 ? true : this.decrementButtonDisabled;
    }
}