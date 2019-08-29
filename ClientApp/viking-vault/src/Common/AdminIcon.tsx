import React from "react";
import icon from "../Resources/images/user.png";
import "./styles.css";
import {Redirect} from "react-router-dom";
import { constants } from "../Resources/Constants";
import UserIconAvatar from "./UserIconAvatar"

const adminProfileDataURL = `${constants.baseUrl}userprofilepages`;

interface IAdminIconState {
  clicked: boolean;
  redirect: boolean;
  adminImage: string;
}

class AdminIcon extends React.Component<any, IAdminIconState> {
  megaMenu: any;

  constructor(props: any) {
    super(props);
    this.state = {
      clicked: false,
      redirect: false,
      adminImage: icon
    };
    this.megaMenu = React.createRef();
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  sendData = () =>{
    setTimeout(() => {
      this.props.parentCallBack(false);
    }, 100);
  }

  componentDidMount() {
    document.addEventListener("click", this.handleOutsideClick, false);
    const token = sessionStorage.getItem("Authentication-Token");
        if(token === null) {
            this.setState({
                redirect: true
            })
        }
        else{         
            fetch(adminProfileDataURL, {
                method: "GET",
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token':  token.toString()
                }})
            .then( response => {
                    if( response.status === 500){
                        return null;
                    }                   
                    return response.json();
                })
            .then( adminData => {
                  this.setState({
                      adminImage: adminData.pictureLink
                  });
              }            
          )       
      }  
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOutsideClick, false);
  }

  handleClick = () =>{
    this.setState({ clicked: !this.state.clicked });
  }

  handleOutsideClick = (event: Event) => {
    if(this.megaMenu == null || this.megaMenu.current == null) return;
    if (!this.megaMenu.current.contains(event.target)) {
      this.setState({
        clicked: false
      });
    }
  }

  handleSignOut = () => {
      sessionStorage.removeItem("Authentication-Token");
      this.setState({
        redirect : true
      });
  }

  render() {
    return (
      <div className="dropdown" ref={this.megaMenu} onClick={this.handleClick}>
        <UserIconAvatar pictureUri={this.state.adminImage} pictureStyle="user-icon img" defaultPicture={icon}/>
        <div className={`mega-menu ${this.state.clicked}`}>
          <div className="mega-menu-content">
            <button className="button-user-icon" onClick = {this.handleSignOut}>Sign out</button>
          </div>
        </div>
        {this.state.redirect ? <Redirect to ="/login"/> : null}
      </div>
    );
  }
}

export default AdminIcon;