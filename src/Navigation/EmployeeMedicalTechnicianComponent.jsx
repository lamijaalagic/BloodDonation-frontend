import React, {Component} from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import "./styleNavigation.css"
import DonationTableComponent from "../DonationTable/DonationTableComponent";
import ProfileComponent from "../User/ProfileComponent";
import TransfusionTableComponent from "../TransfusionTable/TransfusionTableComponent";
import EmployeePage from "../UsersPages/EmployeeMedicalTechnician";
import AddTransfusion from "../TransfusionTable/AddTransfusion";
import AddBloodType from "../User/AddBloodType";

class EmployeeMedicalTechnicianComponent extends Component {
    render() {
        return ( 
            <Router>
                <div className="home">
                    <EmployeePage/>
                    <Route path="/employeeMedicalTechnician/profil" component={ProfileComponent} />
                    <Route path="/employeeMedicalTechnician/transfuzije_krvi" component={TransfusionTableComponent} />
                    <Route path="/employeeMedicalTechnician/tablica_donacija" component={DonationTableComponent} />
                    <Route path="/employeeMedicalTechnician/dodaj_transfuziju" component={AddTransfusion} />
                    <a className="odjava" href="/login" >Odjava</a>
                </div>
            </Router>
        )
    }
}
export default EmployeeMedicalTechnicianComponent