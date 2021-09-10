import React, {Component} from 'react';
import "./LoginComponent.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import LocalStorageService from '../LocalStorage.js';
import jwt from 'jsonwebtoken';
import crvena_kap from '../crvena_kap.png';

class LoginComponent extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            role:'',
            token:'',
            errorMessage:"",
            decoded_token:""
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        localStorage.clear();
        localStorage.setItem('home_link','https://blooddonation5.herokuapp.com');
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        const localStorageService = LocalStorageService.getService();

        axios.post(localStorage.getItem('home_link')+'/authenticate', {
            username: this.state.username,
            password: this.state.password,
        })
            .then((response) => {
                if(response.status === 200 || response.status === 201) {
                    localStorageService.setToken(response.data)
                    //console.log(response)
                    this.state.decoded_token=jwt.decode(response.data.token)
                    //console.log(this.state.decoded_token)
                    axios.post(localStorage.getItem('home_link')+'/validate-token', {
                        username: localStorage.getItem('username'),
                        token:localStorage.getItem('access_token')
                    }).then(response => {
                        if (this.state.decoded_token.role === "ADMIN") {
                            this.props.history.push('/admin')
                        }
                        else if (this.state.decoded_token.role === "USER") {
                            this.props.history.push('/user')
                        }
                        else if (this.state.decoded_token.role === "EMPLOYEE_DOCTOR") {
                            this.state.token = response.data.token
                            this.props.history.push('/employeeDoctor')
                        }
                        else if (this.state.decoded_token.role === "EMPLOYEE_MEDICAL_TECH") {
                            this.state.token = response.data.token
                            this.props.history.push('/employeeMedicalTechnician')
                        }
                        else if (this.state.decoded_token.role === "EMPLOYEE_HOSPITAL_MANAG") {
                            this.state.token = response.data.token
                            this.props.history.push('/employeeHospitalManagement')
                        }
                        toast.success('Uspjesna prijava na sistem', { position: toast.POSITION.TOP_RIGHT })
                    })
                }
            }).catch (err => {
                console.log(err)
                if (!!err && err.response.data.message != null) {
                    toast.error(err.response.data.message.toString(), { position: toast.POSITION.TOP_RIGHT })
                    this.setState({errorMessage:err.response.data.message.toString()});
                }
                else {
                    toast.error('Pogresni podaci', { position: toast.POSITION.TOP_RIGHT })
                }
            });
    }

    render() {
        return (
            <div className="frame">
                
                <div className="header">
                <img className="user_img" src={crvena_kap} alt="Crvena kap"/>
                    <h1>Blood donation</h1>
                    <h2>Unesite podatke</h2>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="username" placeholder="Username" onChange={this.handleChange} />
                    <br/>
                    <input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
                    <br/>
                    <label style={{ color: "red" }}>{this.state.errorMessage}</label>
                    <br/>
                    <button className="submit-btn" type="submit">Login</button>
                    <br/>
                    <button className="back-btn"  onClick={(e)=>{e.preventDefault(); this.props.history.push('/');}}>Nazad na naslovnu stranicu</button>
                </form>
            </div>
        )
    }
}
export default LoginComponent