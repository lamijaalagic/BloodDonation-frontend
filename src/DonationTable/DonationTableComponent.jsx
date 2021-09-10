import axios from 'axios';
import React, {Component, useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import "./Donation.css";
import Moment from 'moment';
import generateDonationsPDF from './ReportDonations';
import crvena_kap from '../crvena_kap.png';
import filter from '../find.png';
import promijeni from '../modify.png';
import dodaj_novi from '../add.png';
import prikazi_detalje from '../show_details.png';

class DonationTableComponent extends Component {

    constructor(props) {
        super(props)
        this.state={
            donacije:[],
            donacijeSVE:[],
            donacijaODABRANA:{},
            user:{},
            donationDate:'',
            donationPlace:'',
            bloodQuantity:'',
            AllUsers:{},
            mjesto:'',
            filterUsername:'',
            errorMessage:'',
            showMe:false,
            NOVOdonationPlace:'',
            NOVObloodQuantity:0,
            showDonator:false,
            donatorODABRANI:{},
            nextDonationDate:'',
            traziMjesec:0,
            traziGodina:'',
            poruka:'Izvjestaj',
            mjesec: [
                { value: '0', label: ''},
                { value: '1', label: 'Januar' },
                { value: '2', label: 'Februar' },
                { value: '3', label: 'Mart' },
                { value: '4', label: 'April' },
                { value: '5', label: 'Maj' },
                { value: '6', label: 'Juni' },
                { value: '7', label: 'Juli' },
                { value: '8', label: 'August' },
                { value: '9', label: 'Septembar' },
                { value: '10', label: 'Oktobar' },
                { value: '11', label: 'Novembar' },
                { value: '12', label: 'Decembar' }
            ],
            odDatuma:null,
            doDatuma:null,
            errorMessage:''
        }
        this.handleChange = this.handleChange.bind(this)

    }

    validateForm = () => { 
        if (this.state.NOVObloodQuantity<0) {
            this.setState({errorMessage:"Unesite kolicinu doniranih doza, broj ne moze biti negativan."});
            return false;
        }
        return true;
    }

    componentDidMount() {
        
            axios.get(localStorage.getItem('home_link')+'/donations', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('access_token')
                }
            })
            .then (response=>{
                const donacije= response.data;
                this.setState({donacije});
                const donacijeSVE=response.data;
                this.setState({donacijeSVE});
            })
        
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.value=="") {
            this.setState({donacije: this.state.donacijeSVE});
        }
    }

    handleChangeMjesec = (selectedOption) => {
        if (selectedOption) {
            this.setState({ traziMjesec: selectedOption.target.value });
        }
    }

    filterByUser(e) {
        e.preventDefault();
        if (this.state.filterUsername!=='') {
            axios.get(localStorage.getItem('home_link')+'/donations/user?username='+this.state.filterUsername, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('access_token')
                }
        }).then(
            response => {
                const donacije= response.data;
                this.setState({donacije});
                this.render();
            }
            ).catch(err => {
                toast.error(err.response.data.message.toString(), { position: toast.POSITION.TOP_RIGHT })
            })
        }
        else this.setState({errorMessage:"Unesite username korisnika po kojem zelite filtrirati."})
    }

    filterByMjesto(e) {
        e.preventDefault();
        if (this.state.mjesto.length !== 0) {
            //const fMjesto=this.state.mjesto;
            axios.get(localStorage.getItem('home_link')+'/donations/donationPlace?donationPlace='+this.state.mjesto, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('access_token')
                }
        }).then(
            response => {
                const donacije= response.data;
                this.setState({donacije});
            }
            ).catch(err => {
                toast.error(err.response.data.message.toString(), { position: toast.POSITION.TOP_RIGHT })
            })
        }
        else this.setState({errorMessage:"Unesite naziv mjesta po kojem zelite filtrirati."})
    }

    uredi(e,profil) {
        if (localStorage.getItem('role')==="ADMIN" || localStorage.getItem('role')==="EMPLOYEE_DOCTOR" || localStorage.getItem('role')==="EMPLOYEE_MEDICAL_TECH") {
            this.setState({donacijaODABRANA:profil});
            this.setState({showMe:true});
        }
        else alert("Opcija omogućena samo za privilegovanog korisnika.");
    }

    modifikujPodatke(e) {
        e.preventDefault();
        if (this.state.NOVObloodQuantity==0) this.state.NOVObloodQuantity=this.state.donacijaODABRANA.bloodQuantity;
        if (this.state.NOVOdonationPlace=='') this.state.NOVOdonationPlace=this.state.donacijaODABRANA.donationPlace;
        if (!this.validateForm()) toast.error("Unesite vrijednosti", { position: toast.POSITION.TOP_RIGHT })
        else {
        axios.put(localStorage.getItem('home_link')+'/donations/'+this.state.donacijaODABRANA.id, {
                user: this.state.donacijaODABRANA.user,
                receiver: this.state.donacijaODABRANA.receiver,
                donationDate: this.state.donacijaODABRANA.donationDate,
                donationPlace:this.state.NOVOdonationPlace,
                bloodQuantity:this.state.NOVObloodQuantity
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('access_token')
            }
    }).then(response => {
            if (response.status === 200 || response.status === 201) {
                this.props.history.push('/')
                alert('Uspješno izmijenjeni podaci');
            }
        }).catch(err => {
            console.log(err.response.data.message.toString())
        })
        this.setState({showMe:false});
        axios.get(localStorage.getItem('home_link')+'/donations', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('access_token')
                }
            })
            .then (response=>{
                const donacije= response.data;
                this.setState({donacije});
                const donacijeSVE=response.data;
                this.setState({donacijeSVE});
            })
        }
    }

    prikazDonatora(e,podaci) {
        e.preventDefault();
        this.setState({donatorODABRANI:podaci});
        //this.nextDonationPosible(this.state.donatorODABRANI.username);
        this.setState({showDonator:true});
    }

    kreirajIzvjestaj(e) {
        e.preventDefault();
        var di=[];
        if (this.state.traziGodina!='' && this.state.traziMjesec!=0) {
            for (let index = 0; index < this.state.donacijeSVE.length; index++) {
                const element = this.state.donacijeSVE[index];
                var datum=new Date(element.donationDate)
                if (datum.getFullYear()==this.state.traziGodina && datum.getMonth()==this.state.traziMjesec-1) {
                    di.push(element);
                }    
            }
            this.state.poruka="Mjesečni izvještaj realizovanih donacija krvi za mjesec "+this.state.traziMjesec; 
        }
        else if (this.state.traziGodina!='') {
            for (let index = 0; index < this.state.donacijeSVE.length; index++) {
                const element = this.state.donacijeSVE[index];
                var datum=new Date(element.donationDate)
                if (datum.getFullYear()==this.state.traziGodina) {
                    di.push(element);
                }    
            }
            this.state.poruka="Godišnji izvještaj realizovanih donacija krvi za godinu "+this.state.traziGodina; 
        }
        else {
            di=this.state.donacijeSVE;
            this.state.poruka="Izvještaj svih realizovanih donacija krvi.";
        }
        generateDonationsPDF(di, this.state.poruka);
    }

    /*kreirajPeriodicniIzvjestaj(e) {
        e.preventDefault();
        var di=[];
        if (this.state.odDatuma!=null && this.state.doDatuma!=null) {
            var od=new Date(this.state.odDatuma);
            var pa_do=new Date(this.state.doDatuma);
            for (let index = 0; index < this.state.donacijeSVE.length; index++) {
                const element = this.state.donacijeSVE[index];
                var datum=new Date(element.donationDate)
                if (od<=datum && datum<=pa_do) {
                    di.push(element);
                }    
            }
            this.state.poruka="Izvještaj realizovanih donacija krvi za period od"+this.state.odDatuma+" do "+this.state.doDatuma; 
        }
        else {
            di=this.state.donacijeSVE;
            this.state.poruka="Izvještaj svih realizovanih donacija krvi.";
        }
        generateDonationsPDF(di, this.state.poruka);

        <br/>
        <label>Izvjestaj za vremenski period od:</label>
        <input className="loginInput"  type="date" onChange={e => this.handleChange(e)} placeholder="Od datuma" name="traziGodina" />
        <label>do: </label>
        <input className="loginInput"  type="date" onChange={e => this.handleChange(e)} placeholder="do datuma" name="traziGodina" />
        <button className="loginButton" onClick={e => this.kreirajPeriodicniIzvjestaj(e)} type="submit">Kreiraj izvještaj za odabrani vremenski period</button>

    }*/

    render() {
        return ( 
            <div className="userView">
                <div >
                <img className="user_img" src={crvena_kap} alt="Crvena kap"/>
                <h2>Tabela donacija</h2>
                </div>
                <div>
                    <table>
                        <tr>
                            <th>Donator krvi id</th>
                            <th>Primalac krvi id</th>
                            <th>Datum donacije</th>
                            <th>Mjesto donacije</th>
                            <th>Količina doniranih doza</th>
                            <th>Uredi podatke</th>
                            <th>Detalji o osobi koja je donirala krv</th>
                            <th>Detalji o osobi koja je primila doniranu krv</th>
                        </tr>
                        {this.state.donacije.map(don => {
                        return(
                        <tr key={don.id}>
                            <td>{don.user.id}</td>
                            <td>{don.receiver.id}</td>
                            <td>{Moment(don.donationDate).format('DD-MM-YYYY')}</td>
                            <td>{don.donationPlace}</td>
                            <td>{don.bloodQuantity}</td>
                            <td><button className="tabelaButton" onClick={e => this.uredi(e,don)}><img className="icons" src={promijeni}/>Uredi</button></td>
                            <td><button className="tabelaButton" onClick={e => this.prikazDonatora(e,don.user)}>Prikaži detalje o donatoru</button></td>
                            <td><button className="tabelaButton" onClick={e => this.prikazDonatora(e,don.receiver)}>Prikaži detalje o primaocu krvi</button></td>
                        </tr>)
})}
                    </table>
                </div>
                <div className="filteri">
                <label><b><i>Filtriraj podatke u tabeli</i></b></label> 
                <br/>
                    <input type="text" onChange={e => this.handleChange(e)} placeholder="Mjesto donacije" name="mjesto"/>
                    <button className="loginButton" type="submit" onClick={e => this.filterByMjesto(e)}><img className="icons" src={filter}/>Filtriraj listu po mjestu donacije</button>
                    <br/>
                    <input type="text" onChange={e => this.handleChange(e)} placeholder="Username" name="filterUsername" />
                    <button className="loginButton" type="submit" onClick={e => this.filterByUser(e)}><img className="icons" src={filter}/>Filtriraj listu po donatoru</button>
                    <br/>
                    <label style={{ color: "red" }}>{this.state.errorMessage}</label>                    
                </div>
                <div className="filteri">
                    <div >
                    <label><b><i>Kreiraj izvještaj</i></b></label>
                    <br/>
                    <p>Kreiraj mjesečni/godišnji izvještaj<br/>
                        Ukoliko želite godišnji izvještaj, odaberite godinu.<br/>
                        Ukoliko želite mjesečni izvještaj odaberite i mjesec i godinu.
                    </p>
                    </div>
                    <div >
                        <label>Izvještaj za mjesec: </label>
                        <select className="selectBox" onChange={(e) => {this.handleChangeMjesec(e);}} value={this.state.traziMjesec} name="traziMjesec">
                            {this.state.mjesec.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                        <input className="loginInput"  type="number" onChange={e => this.handleChange(e)} placeholder="Izvještaj za godinu: " name="traziGodina" />
                        <button className="loginButton" onClick={e => this.kreirajIzvjestaj(e)} type="submit">Kreiraj mjesečni/godišnji izvještaj</button>

                    </div>
                    
                </div>

                {this.state.showMe? 
                <div className="filteri">
                    <label><b><i>Izmijeni podatke odabrane donacije</i></b></label>
                    <br/>
                    <input className="loginInput" type="text" onChange={e => this.handleChange(e)} placeholder="Mjesto donacije" name="NOVOdonationPlace"/>
                    <br/>
                    <input className="loginInput" type="number" onChange={e => this.handleChange(e)} placeholder="Kolicina doza krvi" name="NOVObloodQuantity" />
                    <br/>
                    <label style={{ color: "red" }}>{this.state.errorMessage}</label>
                    <button className="backButton" onClick={e => {this.setState({showMe:false});}} type="submit"> Nazad</button>
                    <button className="okButton" onClick={e => this.modifikujPodatke(e)} type="submit"> Promijeni podatke</button>
                </div>
                 :null}

                {this.state.showDonator? 
                <div className="filteri">
                    <img className="icons" src={prikazi_detalje}/>
                    <label><b><i>Detaljni prikaz podataka odabranog korisnika</i></b></label>
                    
                    <br/>
                    <br/>
                    <label><b>Ime i prezime: </b></label>
                    <label>{this.state.donatorODABRANI.firstname}</label>
                    <label>{this.state.donatorODABRANI.lastname}</label>
                <br/>
                    <label><b>Krvna grupa: </b></label>
                    <lable>{this.state.donatorODABRANI.typeOfBlood.bloodType}</lable>
                    <label>{this.state.donatorODABRANI.typeOfBlood.rhFactor ? '+':'-'}</label>
                    
                <br/>
                    <label><b>Datum rođenja: </b></label>
                    <label>{Moment(this.state.donatorODABRANI.birthDate).format('DD-MM-YYYY')}</label>
                <br/>
                    <label><b>Spol: </b></label>
                    <label>{this.state.donatorODABRANI.gender}</label>
                <br/>
                    <label><b>Mjesto prebivališta: </b></label>
                    <label>{this.state.donatorODABRANI.residencePlace}</label>
                <br/>
                    <label><b>Adresa: </b></label>
                    <label>{this.state.donatorODABRANI.address}</label>
                <br/>
                    <label><b>Broj telefona: </b></label>
                    <label>{this.state.donatorODABRANI.phoneNumber}</label>
                <br/>
                    <label><b>Email: </b></label>
                    <label>{this.state.donatorODABRANI.email}</label>
                <br/>
                
                    <label><b>Potrebna donacija: </b></label>
                    <label>{this.state.donatorODABRANI.donationNeeded ? 'Da':'Ne'}</label>
                <br/>
                    <label><b>Username: </b></label>
                    <label>{this.state.donatorODABRANI.username}</label>
                <br/>
                    <button className="backButton" onClick={e => {this.setState({showDonator:false});}} type="submit"> Nazad</button>
                </div>
                 :null}
            </div>
        )
    }

}
export default DonationTableComponent