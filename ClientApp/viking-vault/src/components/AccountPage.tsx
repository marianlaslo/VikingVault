import React from 'react'
import './styles.css'
import account from './card.png'

const url = "http://localhost:/api/Accounts/"

interface IAccountState{
    balance: number
    card: any
    transactions: []
} 

class AccountPage extends React.Component<any, IAccountState>{
    constructor(props:any){
        super(props);

        this.state={
            balance: 0,
            card: {},
            transactions: []
        }
    }

    componentDidMount(){
        fetch(url).then(
            (response)=> {
                response.json();
            }).then(data=>{
                    })
            .catch(error => console.error('Error:', error));
    }

    render(){
        return(
            <div className="account" style={{display:'inline-flex'}}>
                <img className="cardUnavailable" src={account} alt=""></img>
                <div className="info">
                    <h2>Accounts</h2>
                    <br/><br/><br/>
                    <h5 className="pNew">Please contact your administrator to attach a card to your account</h5>
                </div>
            </div>
        )
    }
}

export default AccountPage