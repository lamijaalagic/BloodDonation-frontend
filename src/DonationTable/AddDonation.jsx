import axios from 'axios';
import React, {Component} from 'react';
import { toast } from 'react-toastify';
import dodaj_novi from '../add.png';
import crvena_kap from '../crvena_kap.png';

class AddDonation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            korisnici:[],
            donationDate:'',
            donationPlace:'',
            bloodQuantity:'',
            odabrani:{},
            username:'',
            errorMessage:'',
            primalac:{}
        }
    }

    validateForm = () => {
        if (this.state.korisnici.length===0) {
            this.setState({errorMessage:"Ne postoje korisnici u sistemu, prvo kreirajte korisnika"});
            return false;
        }
        if (this.state.donationDate==='') {
            this.setState({errorMessage:"Unesite datum kada je donirana krv."});
            return false;
        }
        if (this.state.donationPlace==='') {
            this.setState({errorMessage:"Unesite mjesto donacije"});
            return false;
        }   
        if (this.state.bloodQuantity ==='' || this.state.bloodQuantity<0) {
            this.setState({errorMessage:"Unesite kolicinu doniranih doza, broj ne moze biti negativan."});
            return false;
        }
        return true;
    }

    componentDidMount() {
        axios.get(localStorage.getItem('home_link')+'/user', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('access_token')
            }
        }).then(
            res => {
                const korisnici = res.data
                this.setState({ korisnici })
                if (this.state.korisnici.length!==0)
                    this.setState({odabrani:this.state.korisnici[0]})
            }
        ).catch(err => {
            toast.error(err.response.data.message.toString(), { position: toast.POSITION.TOP_RIGHT })
        })
        
        axios.get(localStorage.getItem('home_link')+'/user/username?username='+'NEREGISTROVAN', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('access_token')
            }
        }).then(
            res => {
                const primalac = res.data
                this.setState({ primalac })
            }
        ).catch(err => {
            toast.error(err.response.data.message.toString(), { position: toast.POSITION.TOP_RIGHT })
        })
        console.log(this.state.primalac)
    }

    handleChangeKorisnici = (selectedOption) => {
        if (selectedOption) {
            const arrayelemnt = this.state.korisnici.filter(item => item.id == selectedOption.target.value)
            this.setState({
                odabrani: arrayelemnt[0],
                username:selectedOption.target.value
            });
            //console.log(this.state.odabrani);
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    createDonation = (event) => {
        //alert(sessionStorage.getItem('primalac'))
        if (sessionStorage.getItem('primalac')!=null) {
            var primalac_id=sessionStorage.getItem('primalac');
            //alert(primalac_id) 
            this.state.korisnici.forEach(k => {
                if (k.id==primalac_id) this.state.primalac=k;
            });
        }
        event.preventDefault();
        console.log(this.state.primalac.toString())
        if (!this.validateForm()) toast.error("Unesite vrijednosti", { position: toast.POSITION.TOP_RIGHT })
        else {
            
            axios.post(localStorage.getItem('home_link')+'/donations', {
                user: this.state.odabrani,
                receiver: this.state.primalac,
                donationDate: this.state.donationDate,
                donationPlace:this.state.donationPlace,
                bloodQuantity:this.state.bloodQuantity
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('access_token')
                }
        }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    this.props.history.push('/')
                    alert("Uspjesno dodana donacija.");
                    if (sessionStorage.getItem('idt')!=null) {
                        this.obrisi_transfuziju(sessionStorage.getItem('idt'));
                        sessionStorage.clear();
                    }
                }
            }).catch(err => {
                console.log(err.response.data.message.toString())
            })
        }
    }

    obrisi_transfuziju(id) {
        axios.delete(localStorage.getItem('home_link')+'/transfusionTable/'+id, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('access_token')
            }
    }).then (response =>{
        if (response.status === 200 || response.status === 201) {
            this.props.history.push('/')
            alert("Uspjesno obrisana donirana transfuzija.");
            toast.success('Uspješno kreirana donacija', { position: toast.POSITION.TOP_RIGHT })
        }
    }).catch(err => {
        console.log(err.response.data.message.toString())
        toast.error(err.response.data.message.toString(), { position: toast.POSITION.TOP_RIGHT })
    })
    }

    render() {
        return (
            <div className="userDiv">
                <form className="registerForma">
                <img className="user_img" src={crvena_kap} alt="Crvena kap"/>
                    <h2> Dodaj novu realizovanu donaciju</h2>
                    <div className="inputGroup">
                        <label>Datum donacije: </label>
                        <input className="loginInput" type="date" onChange={e => this.handleChange(e)} placeholder="Datum doniranja" name="donationDate"/>
                        <br/>
                        <input className="loginInput" type="text" onChange={e => this.handleChange(e)} placeholder="Mjesto donacije" name="donationPlace"/>
                        <br/>
                        <input className="loginInput" type="number" onChange={e => this.handleChange(e)} placeholder="Kolicina donirane krvi" name="bloodQuantity" />
                    </div>
                    <div className="selectWrapper">
                        <label>Krv je donirao (username):</label>
                        <select className="selectBox" onChange={(e) => {this.handleChangeKorisnici(e);}} value={this.state.username} name="username" >
                            {this.state.korisnici.map(kor => <option key={kor.id} value={kor.id}>{kor.username}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ color: "red" }}>{this.state.errorMessage}</label>
                        <br/>
                        <button className="okButton" onClick={e => this.createDonation(e)} type="submit"><img className="icons" src={dodaj_novi}/>  Dodaj donaciju</button>
                    </div>
                </form>
            </div>
        )
    }
}
export default AddDonation