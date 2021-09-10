import axios from 'axios';
import React, {Component} from 'react';
import { toast } from 'react-toastify';
import dodaj_novi from '../add.png';
import novi_user from '../user-add-icon.png'

class AddRole extends Component {

    constructor(props) {
        super(props)
        this.state = {
            roleName:''
        }
    }

    validateForm = () => {
        if (this.state.roleName==='') {
            this.setState({errorMessage:"Unesite potrebne podatke."});
            return false;
        }
        return true;
    }

    componentDidMount() {
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    createRole = (event) => {
        event.preventDefault();
        if (!this.validateForm()) toast.error("Unesite vrijednosti", { position: toast.POSITION.TOP_RIGHT })
        else {
            
            axios.post(localStorage.getItem('home_link')+'/role', {
                roleName: this.state.roleName
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('access_token')
                }
        }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    this.props.history.push('/')
                    alert('Uspješno kreirana uloga');
                }
            }).catch(err => {
                console.log(err.response.data.message.toString())
                toast.error(err.response.data.message.toString(), { position: toast.POSITION.TOP_RIGHT })
            })
        }
    }

    render() {
        return (
            <div className="userDiv">
                <form className="registerForma">
                <img className="icon_image" src={novi_user}/>
                    <h2>Dodaj novu ulogu</h2>
                    <div className="inputGroup">
                        <input className="loginInput" type="text" onChange={e => this.handleChange(e)} placeholder="Uloga korisnika" name="roleName"/>
                    </div>
                    <div>
                        <label style={{ color: "red" }}>{this.state.errorMessage}</label>
                        <br/>
                        <button className="okButton" onClick={e => this.createRole(e)} type="submit"> <img className="icons" src={dodaj_novi}/> Kreiraj ulogu</button>
                    </div>
                </form>
            </div>
        )
    }
}
export default AddRole