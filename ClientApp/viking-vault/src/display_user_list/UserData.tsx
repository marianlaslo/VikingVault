import React from "react";
import '../components/styles.css';
import './DisplayUsers.css';
import DefaultProfilePicture from '../UI/user2.png';
import CardImg from '../UI/GENERICcard-01.png';
import { constants } from "../ConstantVariables";

export interface IUserData{
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    pictureLink: string;
    cardNumber: string;
    expirationDate: string;
}

class UserData extends React.Component<IUserData, IUserData>{
    
    constructor(props: IUserData)
    {
        super(props);

        if(props != null)
        {
            this.state = {
                id: props.id,
                firstName: props.firstName,
                lastName: props.lastName,
                address: props.address,
                email: props.email,
                pictureLink: props.pictureLink,
                cardNumber: props.cardNumber,
                expirationDate: props.expirationDate
            };
        }
        else
        {
            this.state = {
                id: 0,
                firstName: "no-data",
                lastName: "no-data",
                address: "no-data",
                email: "no-data",
                pictureLink: "",
                cardNumber: "no-data",
                expirationDate: "no-data"
            };
        }        
    }

    render(){
        return(
         
            <div className = "user-container"> 
                <div className = "user-container-inside">
                    <div className = "img-container">
                         {this.state.pictureLink === "" ? <img src = {DefaultProfilePicture} className = "profile-img"/> : <img src = {this.state.pictureLink} className = {this.state.pictureLink}/> }                 
                    </div>
                    
                    <div className = "profile-data-container">
                        <span className = "profile-data-text" id = "user_name"> {this.state.firstName} {this.state.lastName} </span>
                        <span className = "profile-data-text"> {this.state.address} </span>
                        <span className = "profile-data-text" id = "card_number"> {this.state.cardNumber} </span>
                    </div>

                    <div className = "card-container">
                        {this.state.cardNumber !== ""? 
                                                        <div className = "card-data-style">
                                                            <p className = "name-on-card">{this.state.firstName} {this.state.lastName}</p>
                                                            <p className = "expiration-date-on-card">{this.state.expirationDate}</p>
                                                            <p className = "card-number-on-card">{this.state.cardNumber}</p>
                                                            <img src = {CardImg} className = "card-img"></img>
                                                        </div>

                                                       : null}
                    </div>

                    <div className = "button-container">
                        <button className = "button-style">Attach Card</button>
                        <button className = "button-style">Delete</button>
                        <button className = "button-style">Add Money</button>
                    </div>
                </div>
            </div>           
         );   
    }
}

export { UserData };