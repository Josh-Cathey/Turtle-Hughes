import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isGuest from '@salesforce/user/isGuest';
import communityBasePath from '@salesforce/community/basePath';
import createCart from '@salesforce/apex/AdVic_GuestCartController.createCart';
import addProductToCart from '@salesforce/apex/AdVic_GuestCartController.addProductToCart';

// TESTING 
//import addProductToCart from '@salesforce/apex/AdVic_GuestCartController.createCartWithItem';


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
    @track cart;
    @track cartItems = [];
    
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
        console.log('(this.cart == null) = ' + (this.cart == null));
        console.log('this.cart = ' + this.cart);
        if (this.cart == null) {
            this.getCartFromLocalStorage();
            console.log('Inside connectedCallback');
            console.log('this.cart = ');
            console.log(this.cart);
        }

        // console.log('productDetailsDisplay.js: this.recordId = ' + this.recordId);
        this.recordId = this.recordId != null ? this.recordId : '01t7c00000748qsAAA'; // recordId is currently returning as undefined...
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
        else if (isGuest && this.cart != null) {
            // let quantity = this._quantityFieldValue;
            // console.log('notifyAddToCart was called!! this.quantity = ' + quantity);

            this.addItemToGuestCart();
        }
        else if (isGuest && this.cart == null) {
            this.getCartFromLocalStorage();
            // console.log('inside notifyAddToCart(): after calling for cart, this.cart = ' + JSON.parse(this.cart)); 
            // console.log('pull directly from local storage');
            // console.log(JSON.parse(localStorage.getItem('Cart')));
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
        // displaying an alert message for testing to notify any testers that this functionality is not ready
        //alert('Sorry, this feature is not available yet. Please try again later.');

        // if (this.guestCart == null) // this would be pulled from localStorage in connected callback and set as a param in this LWC
        this.checkoutAsGuest = true;
        this.promptGuestToSignIn = false;

        this.initGuestCart();
    }

    initGuestCart() {
        createCart({})
            .then((data) => {
                // console.log('Cart without item');
                // console.log(data);
                this.cart = data;
                
                // console.log('Calling addItemToGuestCart()');
                this.addItemToGuestCart();
            })
            .catch(error => { console.error('Error creating guest cart -> ' + error.body.message); })
    }

    addItemToGuestCart() {
        // Check if the same product is being added to the cart
        if (this.cart.product__c == this.recordId) {
            // we need to call code here to increment the quantity on the product
        }
        // console.log('Called addItemToGuestCart()');
        // console.log('Quantity requested, this._quantityFieldValue = ' + this._quantityFieldValue);

        // local storage is currently saving the Guest_Cart_Item__c, so when adding another product to the cart
        // we are actually passing the Guest_Cart_Item__c Id, not the actual Guest_Cart__c Id
        // Need to address this!
        addProductToCart({cartId: this.cart.Id, productId: this.recordId, quantity: this._quantityFieldValue})
            .then((data) => {
                this.cart = data;
                // console.log('Cart with item');
                // console.log(data);

                // TESTING -> save to local storage
                this.setCartToLocalStorage();
                //this.getCartFromLocalStorage();
            })
            .catch(error => { console.error('Error creating guest cart item -> ' + error.body.message); })
    }

    setCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    getCartFromLocalStorage() {
        // console.log('called getCartFromLocalStorage()');
        console.log('Reading cart in local storage');
        console.log(JSON.parse(localStorage.getItem('cart')));
        this.cart = JSON.parse(localStorage.getItem('cart'));
    }
}