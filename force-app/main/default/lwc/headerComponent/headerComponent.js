import { LightningElement,wire,track} from 'lwc';
import fetchUserDetail from '@salesforce/apex/headerComponentController.fetchUserDetail';
import TURTLE_LOGO from '@salesforce/resourceUrl/turtleLogo';
import basePath from '@salesforce/community/basePath';
import fetchCartInfo from '@salesforce/apex/headerComponentController.fetchCartInfo';
import fetchCartItems from '@salesforce/apex/headerComponentController.fetchCartItems';


export default class HeaderComponent extends LightningElement {
logo = TURTLE_LOGO;
showShoppingItem=true;
showGuestCart=false;
isGuest=false;
showAuthUserCart = false;
showItems = false;
    //Properties
    userData
    searchWord
    @track contactId;
    @track profileImg   
    @track userName
    @track userFirstName
    @track logoutUrl
    @track cartItemsInfo = [];
    
    connectedCallback(){
        fetchUserDetail().then(data=>{
            if (data) {
                this.userData = data;
                console.log('data>>>',data);
                console.log('contactId>>',this.userData.ContactId);
                if(this.userData.Profile.Name =='Turtle and Hughes Guest Profile'){
                    this.isGuest = true;
                    this.contactId = this.userData.ContactId;
                }else if(this.userData.Profile.Name == 'Turtle Storefront User' || this.userData.Profile.Name == 'System Administrator'){
                    this.isGuest = false;
                    this.profileImg = this.userData.MediumPhotoUrl;
                    this.userName = this.userData.Name;
                    let userFullName = this.userName;
                    this.userFirstName = userFullName.split(' ')[0];
                    this.contactId = this.userData.ContactId;
                }
            }
        }).catch(error=> {
            this.isGuest = true;
            this.error = error;
            console.log('erroeeee>>>',error);
        })
        }
    loginLink() {
        return window.open('/login','_self');
    }
    home(){
        return window.open('/s','_self');
    }
    guestCart(){
        console.log('guestCart');
        var cartId;
        fetchCartInfo({conId:this.contactId}).then(result=>{
            console.log('result when click over guest cart>>'+ result );
            cartId = result;
        }).catch(error=>{
            console.log(error);
        })
        return window.open('/s/cart/'+cartId,'_self');
    }
    userCart(){
        console.log('userCart');
        var cartId;
        fetchCartInfo({conId:this.contactId}).then(result=>{
            console.log('result when click over guest cart>>'+ result );
            cartId = result;
            console.log('cartId>>'+cartId);
            return window.open('cart/'+cartId,'_self');
        }).catch(error=>{
            console.log(error);
        })
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.showGuestCart = false;
        this.showAuthUserCart = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.showGuestCart = false;
        this.showAuthUserCart = false;
    }
    searchItem(event){
        this.searchWord = event.target.value;
    }
    searchProducts(){
        console.log(this.searchWord);
        return window.open('/s/global-search/'+this.searchWord,'_self');
    }
    showUserCart(){
        fetchCartItems({conId:this.contactId}).then(result=>{
            this.cartItemsInfo = [];
            console.log(result);
            this.cartItemsInfo.push(result);
            this.showItems = true;
            this.showAuthUserCart = true;
        }).catch(error=>{
            console.log(error);
        })
    }
    removeUserCart(){
        this.showAuthUserCart = false;
    }
}