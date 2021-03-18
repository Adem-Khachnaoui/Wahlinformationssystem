import React from "react";
import './App.css';
import {WahlErgebnisse} from "./Components/WahlErgebnisse";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {LandingPage} from "./Components/LandingPage";
import {Stimmabgabe} from "./Components/Stimmabgabe";
import 'react-notifications/lib/notifications.css';
import NotificationContainer from "react-notifications/lib/NotificationContainer";

export const BASE_URL = "/api/";

function App() {


    return (
        <div>
            <NotificationContainer/>
            <BrowserRouter>
                <Switch>
                    <Route path="/ergebnisse" component={WahlErgebnisse}/>
                    <Route path="/stimmabgabe" component={Stimmabgabe}/>
                    <Route path="/" component={LandingPage}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
