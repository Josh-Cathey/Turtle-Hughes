import { LightningElement, api, track } from 'lwc';
import isGuest from '@salesforce/user/isGuest';
import { getDataConnectorSourceFields } from 'lightning/analyticsWaveApi';
import communityBasePath from '@salesforce/community/basePath';
import { NavigationMixin } from 'lightning/navigation';
import createCart from '@salesforce/apex/AdVic_GuestCartController.createCart';
import addProductToCart from '@salesforce/apex/AdVic_GuestCartController.addProductToCart';
import adjustProductQuantity from '@salesforce/apex/AdVic_GuestCartController.adjustProductQuantity';
import retrieveUpdatedGuestCart from '@salesforce/apex/AdVic_GuestCartController.retrieveUpdatedGuestCart';

/**
 * An organized display of a single product card.
 *
 * @fires SearchCard#calltoaction
 * @fires SearchCard#showdetail
 */
export default class SearchCard extends NavigationMixin(LightningElement) {
    @track promptGuestToSignIn = false;
    @track id;
    @track createAccountUrl;
    @track checkoutAsGuest = false;
    @track products = [];
    @track cart;
    @track cartConfig;

    /**
     * An event fired when the user clicked on the action button. Here in this
     *  this is an add to cart button.
     *
     * Properties:
     *   - Bubbles: true
     *   - Composed: true
     *   - Cancelable: false
     *
     * @event SearchLayout#calltoaction
     * @type {CustomEvent}
     *
     * @property {String} detail.productId
     *   The unique identifier of the product.
     *
     * @export
     */

    /**
     * An event fired when the user indicates a desire to view the details of a product.
     *
     * Properties:
     *   - Bubbles: true
     *   - Composed: true
     *   - Cancelable: false
     *
     * @event SearchLayout#showdetail
     * @type {CustomEvent}
     *
     * @property {String} detail.productId
     *   The unique identifier of the product.
     *
     * @export
     */

    /**
     * A result set to be displayed in a layout.
     * @typedef {object} Product
     *
     * @property {string} id
     *  The id of the product
     *
     * @property {string} name
     *  Product name
     *
     * @property {Image} image
     *  Product Image Representation
     *
     * @property {object.<string, object>} fields
     *  Map containing field name as the key and it's field value inside an object.
     *
     * @property {Prices} prices
     *  Negotiated and listed price info
     */

    /**
     * A product image.
     * @typedef {object} Image
     *
     * @property {string} url
     *  The URL of an image.
     *
     * @property {string} title
     *  The title of the image.
     *
     * @property {string} alternativeText
     *  The alternative display text of the image.
     */

    /**
     * Prices associated to a product.
     *
     * @typedef {Object} Pricing
     *
     * @property {string} listingPrice
     *  Original price for a product.
     *
     * @property {string} negotiatedPrice
     *  Final price for a product after all discounts and/or entitlements are applied
     *  Format is a raw string without currency symbol
     *
     * @property {string} currencyIsoCode
     *  The ISO 4217 currency code for the product card prices listed
     */

    /**
     * Card layout configuration.
     * @typedef {object} CardConfig
     *
     * @property {Boolean} showImage
     *  Whether or not to show the product image.
     *
     * @property {string} resultsLayout
     *  Products layout. This is the same property available in it's parent
     *  {@see LayoutConfig}
     *
     * @property {Boolean} actionDisabled
     *  Whether or not to disable the action button. We are currently setting this to false, for testing.
     */

    /**
     * Gets or sets the display data for card.
     *
     * @type {Product}
     */
    @api
    displayData;

    /**
     * Gets or sets the card layout configurations.
     *
     * @type {CardConfig}
     */
    @api
    config;

    /**
     * Gets the product image.
     *
     * @type {Image}
     * @readonly
     * @private
     */
    get image() {
        return this.displayData.image || {};
    }

    /**
     * Gets the product fields.
     *
     * @type {object.<string, object>[]}
     * @readonly
     * @private
     */
    get fields() {
        return (this.displayData.fields || []).map(({ name, value }, id) => ({
            id: id + 1,
            tabIndex: id === 0 ? 0 : -1,
            // making the first field bit larger
            class: id
                ? 'slds-truncate slds-text-heading_small'
                : 'slds-truncate slds-text-heading_medium',
            // making Name and Description shows up without label
            // Note that these fields are showing with apiName. When builder
            // can save custom JSON, there we can save the display name.
            value:
                name === 'Name' || name === 'Description'
                    ? value
                    : `${name}: ${value}`
        }));
    }

    /**
     * Whether or not the product image to be shown on card.
     *
     * @type {Boolean}
     * @readonly
     * @private
     */
    get showImage() {
        return !!(this.config || {}).showImage;
    }

    /**
     * Whether or not disable the action button.
     *
     * @type {Boolean}
     * @readonly
     * @private
     */
    get actionDisabled() {
        //return !!(this.config || {}).actionDisabled;
        
        // ONLY FOR TESTING - Returning false for now
        return false;
    }

    /**
     * Gets the product price.
     *
     * @type {string}
     * @readonly
     * @private
     */
    get price() {
        const prices = this.displayData.prices;
        return prices.negotiatedPrice || prices.listingPrice;
    }

    /**
     * Whether or not the product has price.
     *
     * @type {Boolean}
     * @readonly
     * @private
     */
    get hasPrice() {
        return !!this.price;
    }

    /**
     * Gets the original price for a product, before any discounts or entitlements are applied.
     *
     * @type {string}
     */
    get listingPrice() {
        return this.displayData.prices.listingPrice;
    }

    /**
     * Gets whether or not the listing price can be shown
     * @returns {Boolean}
     * @private
     */
    get canShowListingPrice() {
        const prices = this.displayData.prices;

        return (
            prices.negotiatedPrice &&
            prices.listingPrice &&
            // don't show listing price if it's less than or equal to the negotiated price.
            Number(prices.listingPrice) > Number(prices.negotiatedPrice)
        );
    }

    /**
     * Gets the currency for the price to be displayed.
     *
     * @type {string}
     * @readonly
     * @private
     */
    get currency() {
        return this.displayData.prices.currencyIsoCode;
    }

    /**
     * Gets the container class which decide the innter element styles.
     *
     * @type {string}
     * @readonly
     * @private
     */
    get cardContainerClass() {
        return this.config.resultsLayout === 'grid'
            ? 'slds-box card-layout-grid'
            : 'card-layout-list';
    }

    connectedCallback() {
        //console.log('productDetailsDisplay.js: this.displayData.id (Id of the product) = ' + this.displayData.id);
        if (this.cartConfig == null && isGuest) {
            this.getCartFromLocalStorage();
            
            // console.log('Inside ConnectedCallback(): cartConfig');
            // console.log(JSON.parse(JSON.stringify(this.cartConfig)));

            // console.log('Inside ConnectedCallback(): cart');
            // console.log(JSON.parse(JSON.stringify(this.cart)));

            // console.log('Inside ConnectedCallback(): products');
            // console.log(JSON.parse(JSON.stringify(this.products)));
        }
    }

    /**
     * Emits a notification that the user wants to add the item to their cart.
     *
     * @fires SearchCard#calltoaction
     * @private
     */
    notifyAction() {
        if (!isGuest) {
            this.dispatchEvent(
                new CustomEvent('calltoaction', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        productId: this.displayData.id,
                        productName: this.displayData.name
                    }
                })
            );
        }

        // Because each product card has its own state, we need to fetch the cart every time
        // a new product card "add to cart" button is clicked
        this.getCartFromLocalStorage();
        if (isGuest && this.cartConfig != null) {
            this.addItemToGuestCart();
        }
        else if (isGuest && this.cartConfig == null) {
            this.getCartFromLocalStorage();
            this.promptGuestToSignIn = true;
        }
    }

    /**
     * Emits a notification that the user indicates a desire to view the details of a product.
     *
     * @fires SearchCard#showdetail
     * @private
     */
    notifyShowDetail(evt) {
        evt.preventDefault();

        this.dispatchEvent(
            new CustomEvent('showdetail', {
                bubbles: true,
                composed: true,
                detail: { productId: this.displayData.id }
            })
        );
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
        var foundMatchingItem = false;
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].Product__c === this.displayData.id) {
                foundMatchingItem = true;

                // if found, increment the quantity on the product
                // update the guest cart item record in apex
                // then return the item, and update the item in the array
                // you can only add a single product from the PLP
                adjustProductQuantity({guestCartItemId: this.products[i].Id, quantity: 1})
                    .then((data) => {
                        this.products[i] = data;
                        this.updateCart();
                        this.setCartToLocalStorage();
                    })
                    .catch(error => { console.error('Error adjusting quantity for guest cart item -> ' + error); })

                // if a record is found, break out of the loop
                break;
            }
        }

        if (!foundMatchingItem) {
            addProductToCart({cartId: this.cart.Id, productId: this.displayData.id, quantity: 1})
                .then((data) => {
                    this.products.push(data);
                    this.updateCart();
                    this.setCartToLocalStorage();
                })
                .catch(error => { console.error('Error creating guest cart item -> ' + error); })
        }
    }

    updateCart() {
        retrieveUpdatedGuestCart({cartId: this.cart.Id})
            .then((data) => {
                // console.log('Calling retrieveUpdatedGuestCart');
                // console.log(data);
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
}