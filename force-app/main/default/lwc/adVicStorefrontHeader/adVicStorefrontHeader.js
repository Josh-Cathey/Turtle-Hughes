/*
Ad Victoriam Solutions -
Purpose: Storefront Header
Changelog:
    22 Jul 2022 by seth.ortiz
        - Created initial file.
*/
import Id from '@salesforce/user/Id';
import isGuest from '@salesforce/user/isGuest';
import communityBasePath from '@salesforce/community/basePath';
import { LightningElement, api, wire,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFld from '@salesforce/schema/User.Name';
import FirstNameFld from '@salesforce/schema/User.FirstName';
import userEmailFld from '@salesforce/schema/User.Email';
import userIsActiveFld from '@salesforce/schema/User.IsActive';
import userAliasFld from '@salesforce/schema/User.Alias';
import getGuestCartItems from '@salesforce/apex/AdVic_GuestCartController.retrieveGuestCartItems';

export default class adVicStorefrontHeader extends NavigationMixin(LightningElement) {

    @track cart;
    cmsContentContainer = {};
    contentToInitialize = [];
    nameByContentReferenceId = new Map();
    guestUser = isGuest;
    isLoading;
    @track badgeNumber;
    recordId = 'a3T7c000000UOIUEA4';
    listOfGuestCartItems=[];
    
    
   

    get welcomeGreeting() {
        return (this.currentUserFirstName ? 'Welcome, '   : 'Welcome');
    }

    get userFirstName() {
        return (this.currentUserFirstName ? this.currentUserFirstName  : '');
    }

    handleNavigationClick(event){
        this.navigateToCommPage(event.currentTarget.dataset.navid);
    }

    handleExternalLinkClick(event){
        this.navigateToExternalPage(event.currentTarget.dataset.navid);
    }

    navigateToCommPage(apiName) {
        // console.log('navigating to page: ', apiName);
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                name: apiName
            }
        });
    }

    navigateToExternalPage(url) {
        const config = {
            type: 'standard__webPage',
            attributes: {
                url: url
            }
        };
        this[NavigationMixin.Navigate](config);
    }

    userId = Id;
    currentUserName;
    currentUserEmailId;
    currentIsActive;
    currentUserAlias;
    currentUserFirstName;
    error;
    _providedItems;
    
    /*
     * Get User Record to map data to LWC
     */
    @wire(getRecord, { recordId: '$userId', fields: [UserNameFld, FirstNameFld, userEmailFld, userIsActiveFld, userAliasFld ]})
    userDetails({error, data}) {
        if (data) {
            // console.log(JSON.stringify(data, null, 4));
            this.currentUserFirstName = data.fields.FirstName.value;
            this.currentUserName = data.fields.Name.value;
            this.currentUserEmailId = data.fields.Email.value;
            this.currentIsActive = data.fields.IsActive.value;
            this.currentUserAlias = data.fields.Alias.value;
        } else if (error) {
            this.error = error;
        }
    }
    // Changes Made By Daniel 
    /*connectedCallback() {
        getGuestCartItems({guestCartId:this.recordId}).then(result=>{
            console.log('result got>>'+JSON.stringify(result));
            this.listOfGuestCartItems = result;
            if(this.listOfGuestCartItems.length == 0){
                this.badgeNumber = 0;
            }else{
                this.badgeNumber = this.listOfGuestCartItems.length;
            }
            console.log(this.badgeNumber);
        }).catch(error=>{
            console.log(error);
        })
    }*/
    cart;
    connectedCallback() {
        console.log('(this.cart == null) = ' + (this.cart == null));
        console.log('this.cart = ' + this.cart);
        if (this.cart == null) {
             this.cart = this.getCartFromLocalStorage();
             console.log('Gcart',this.cart.Guest_Cart__c);
             getGuestCartItems({guestCartId:this.cart.Guest_Cart__c}).then(result=>{
                console.log('result got>>'+JSON.stringify(result));
                this.listOfGuestCartItems = result;
                if(this.listOfGuestCartItems.length == 0){
                    this.badgeNumber = 0;
                }else{
                    this.badgeNumber = this.listOfGuestCartItems.length;
                }
                console.log(this.badgeNumber);
            }).catch(error=>{
                console.log(error);
            })
            console.log('Inside connectedCallback');
            console.log('this.cart = ');
            console.log(this.cart);
        }

        // console.log('productDetailsDisplay.js: this.recordId = ' + this.recordId);
        //this.recordId = this.recordId != null ? this.recordId : '01t7c00000748qsAAA'; // recordId is currently returning as undefined...
        
    }
    setCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    getCartFromLocalStorage() {
        // console.log('called getCartFromLocalStorage()');
        console.log('Reading cart in local storage');
        console.log(JSON.parse(localStorage.getItem('cart')));
        this.cart = JSON.parse(localStorage.getItem('cart'));
        return this.cart;
    }
    guestCart()
    {
        console.log('cart',JSON.stringify(this.cart.Guest_Cart__c));
        return window.open('/s/guest-cart/'+this.cart.Guest_Cart__c+'/'+this.cart.Name,'_self');
    }
    
}