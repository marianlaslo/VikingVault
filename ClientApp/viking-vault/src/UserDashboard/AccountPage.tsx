import React from 'react'
import '../Common/styles.css'
import inexistentCard from '../Resources/images/card.png'
import genericCard from '../Resources/images/GENERICcard-01.png'
import genericCardGrayscale from '../Resources/images/GENERICcard-01-grayscale.jpg'
import {constants} from "../Resources/Constants";
import { Redirect } from 'react-router-dom';
import { TransactionList } from './TransactionList';
import ToggleBlockCard from './ToggleBlockCard';
import ResponseModal from '../AdminDashboard/ResponseModal';

const url = constants.baseUrl+"Accounts/";
const updateCardUrl = constants.baseUrl+"updateCard/";

interface IAccountBalance{
    ronBalance: number;
    eurBalance: number;
    usdBalance: number;
    yenBalance: number;
}

interface IAccountState{
    firstName: string
    lastName: string
    cardId: number
    cardNumber: string
    CCV: number
    expirationDate: string
    accountsBalances: IAccountBalance
    totalBalance: number
    isPresent: boolean
    isCardBlocked: boolean
    redirect: boolean
    openBlockCardResponseModal: boolean
    blockCardResponseMessage: string
} 

class AccountPage extends React.Component<any, IAccountState>{
    
    constructor(props:any){
        super(props);
        this.state={
            firstName: "",
            lastName: "",
            cardId: 0,
            cardNumber: "",
            CCV: 0,
            expirationDate: "",
            accountsBalances: { 
                ronBalance: 0,
                eurBalance: 0,
                usdBalance: 0,
                yenBalance: 0
        },
            totalBalance: 0,
            isPresent: true,
            isCardBlocked : false,
            redirect:false,
            openBlockCardResponseModal: false,
            blockCardResponseMessage: ""
        }
    }
    
    updateExchangingRates=() => {
        fetch("https://api.exchangeratesapi.io/latest?base=RON").
        then(response =>{
            return response.json();
        }).then((data:any)=>{
            if(data!==null){
                this.setState({
                    totalBalance: this.state.accountsBalances.ronBalance + 
                    (this.state.accountsBalances.eurBalance/data.rates.EUR) + 
                    (this.state.accountsBalances.usdBalance/data.rates.USD) + 
                    (this.state.accountsBalances.yenBalance/data.rates.JPY)
                })
            }
        })
    }
    
    componentDidMount(){
        let token = sessionStorage.getItem("Authentication-Token");
        if(token === null)
        {
            this.setState({
                redirect:true
            })
        }
        else
        {
            setInterval(this.updateExchangingRates, constants.ratesRefreshInterval);
            fetch(url, {
                method:"GET",
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token' : token.toString()
                }})
                .then((response)=> {
                    if(response.status === 404){
                        this.setState({
                            isPresent: true
                        })
                    }
                    if(response.status === 200){
                        this.setState(oldState => {
                            return {
                                isPresent: false
                            }
                        })
                    }
                    return response.json();})
                .then((userData:any)=>{
                    if(userData != null){
                        this.setState(
                            {
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                cardId : userData.cardId,
                                cardNumber: userData.cardNumber,
                                CCV: userData.ccv,
                                expirationDate: userData.expirationDate,
                                isCardBlocked: userData.blockedCard,
                                accountsBalances: {
                                    ronBalance: userData.ronBalance,
                                    eurBalance: userData.eurBalance,
                                    usdBalance: userData.usdBalance,
                                    yenBalance: userData.yenBalance,
                                }
                            }
                        )
                    }
                })
                .catch(error => {
                    this.setState({
                        isPresent: true
                    })
                })
        }
    }
        
    showCardInformations(){
        return (
        <div className="card-picture-container">
            <p className="card-number-large">{this.splitCardNumber(0,4)} &nbsp; {this.splitCardNumber(4,8)} &nbsp; {this.splitCardNumber(8,12)} &nbsp; {this.splitCardNumber(12,16)}</p>
            <p className="card-expiration-date">{this.state.expirationDate}</p>
            <p className="card-owner-name">{this.state.firstName} {this.state.lastName}</p>
            <img className="card-available" src = {!this.state.isCardBlocked ? genericCard : genericCardGrayscale} alt=""></img>
        </div>)
    }

    showUnavailableCard(){
        return (
        <div className="card-picture-container">
            <img className="card-available" src={inexistentCard} alt=""></img>
        </div>)
    }

    accountsInformation(){
        return <div>  
            <div className="balance-container">
                <p className="balance-header">RON <span className="balance-value">{this.state.totalBalance.toFixed(2)}</span></p> 
                <p className="balance-information">Total balance</p>
            </div>
            <br/>
            <div className="balance-container">
                <p className="accounts-container">
                    RON <span className="account-value">{this.state.accountsBalances.ronBalance}</span> &nbsp; &nbsp; 
                    EUR <span className="account-value">{this.state.accountsBalances.eurBalance}</span> &nbsp; &nbsp; 
                    USD <span className="account-value">{this.state.accountsBalances.usdBalance}</span> &nbsp; &nbsp; 
                    YEN <span className="account-value">{this.state.accountsBalances.yenBalance}</span> </p> 
            </div>
            <br/><br/>
            <TransactionList />
        </div>
    }

    inexistentCardNotification(){
        return (
        <div>
            <br/><br/><br/>
            <h5 className="no-card-text">Please contact your administrator to attach a card to your account</h5>
        </div>
        )
    }

    splitCardNumber(begin: number, end: number){
        return this.state.cardNumber.substring(begin, end);
    }

    blockCard = () =>{
        const token = sessionStorage.getItem('Authentication-Token');
        if(token === null) return;
        fetch(updateCardUrl, {
            method: "PUT",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-access-token': token
            },
            body: JSON.stringify({
              Id: this.state.cardId,
              CardNumber: this.state.cardNumber,
              ExpirationDate: this.state.expirationDate,
              CCV: this.state.CCV,
              Blocked: !this.state.isCardBlocked
            })}).then(response => {   
                if(response.status === 200){
                    let oldState = this.state.isCardBlocked;
                    this.setState({
                        isCardBlocked : !oldState
                    });
                }
                else{
                   this.openResponseModalWithMessage("Something wrong happened. Try again later!")
                }
            }).catch(err => {
                this.openResponseModalWithMessage("Something wrong happened. Try again later!")
            });
    }

    private openResponseModalWithMessage = (message : string) =>{
        this.setState({
            openBlockCardResponseModal : true,
            blockCardResponseMessage : message
        });
    }

    closeBlockCardModal = () =>{
        this.setState({
            openBlockCardResponseModal : false
        });
    }

    render(){
        return(            
            <div className="account-view"> 
                { this.state.redirect? <Redirect to = "/login"  /> : null}       
                {this.state.isPresent ?  this.showUnavailableCard() : this.showCardInformations()}
                <div className="accounts-information">
                    <div className="accounts-title">
                        <h2 className="accounts-header">Accounts</h2>
                    </div>
                    {this.state.isPresent ? this.inexistentCardNotification() : this.accountsInformation()}
                </div>
                {this.state.redirect? <Redirect to="/login"/> : null}
                <div className = "block-card-toggle-position"> {!this.state.isPresent ? <ToggleBlockCard toggleSwitch = {this.blockCard} isCardBlocked = {this.state.isCardBlocked}/> : null} </div>
                <ResponseModal open = {this.state.openBlockCardResponseModal}  closeModal = {this.closeBlockCardModal} message = {this.state.blockCardResponseMessage}/>

            </div>
        )
    }
}

export default AccountPage
