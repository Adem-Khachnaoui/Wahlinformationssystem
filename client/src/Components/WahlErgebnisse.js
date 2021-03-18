import React, {Fragment, useEffect, useState} from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css'
import {GesamtergebnisView} from "./JahrErgebnis/GesamtergebnisView";
import {StimmkreisView} from "./JahrErgebnis/StimmkreisView";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {VergleichStimmkreis} from "./Vergleiche/VergleichStimmkreis";
import BootstrapSwitchButton from "bootstrap-switch-button-react/lib/bootstrap-switch-button-react";
import {WahlkreisView} from "./JahrErgebnis/WahlkreisView";
import {AnalyseView} from "./Analyse/AnalyseView";
import {VergleichWahlkreis} from "./Vergleiche/VergleichWahlkreis";
import {VergleichGesamt} from "./Vergleiche/VergleichGesamt";
import {ClipLoader} from "react-spinners";
import LoadingOverlay from "react-loading-overlay";
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';
import {NotificationManager} from "react-notifications";
import {BASE_URL} from "../App";

const Views = {
    Gesamt: "gesamt",
    Wahlkreis: "wahlkreis",
    Stimmkreis: "stimmkreis",
    Analyse: "analyse",
}

const Filters = {
    Y2018: "2018",
    Y2013: "2013",
    Comparison: "vergleich"
};

export const Spinner = props => {
    const style = {position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
    return (
        <div style={style}>
            <ClipLoader color={"#a9a9a9"}/>
        </div>
    );
};


export async function refreshViews(setLoading, reloadPage = true) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
    };

    try {
        const response = await fetch(BASE_URL + 'refreshdata', requestOptions);
        if (response.status === 200) {
            if (reloadPage) {
                window.location.reload()
            }
        } else {
            NotificationManager.error("Fehler beim Reload")
        }
    } catch (err) {
        console.error(err.message);
    }
    setLoading(false);
}

export function WahlErgebnisse(props) {

    function getInitialUseAggregates() {
        const value = localStorage.getItem( 'useAggregates' ) || "true";
        localStorage.setItem( 'useAggregates', value );
        return value
    }

    function setUseAggregates(newValue) {
        localStorage.setItem( 'useAggregates', newValue );
        setUseAggregatesLocal(newValue)
    }

    const [state, setState] = useState({
        selectedView: Views.Gesamt,
        selectedFilter: Filters.Y2018,
        selectedStimmkreis: "München-Hadern",
        selectedWahlkreis: "Niederbayern"
    })

    const [stimmkreise, setStimmkreise] = useState([]);

    const [wahlkreise, setWahlkreise] = useState([]);

    const [useAggregates, setUseAggregatesLocal] = useState(getInitialUseAggregates());

    const [loading, setLoading] = useState(false);

    const updateStimmkreise = async () => {
        try {
            const response = await fetch(BASE_URL  + state.selectedFilter + "/stimmkreise");
            const jsonData = await response.json();
            setStimmkreise(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const updateWahlkreise = async () => {
        try {
            const response = await fetch(BASE_URL  + state.selectedFilter + "/wahlkreise");
            const jsonData = await response.json();
            setWahlkreise(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        updateStimmkreise();
        updateWahlkreise();
    }, []);

    function changeView(value) {
        if (Object.values(Views).includes(value.target.value)) {
            if (value.target.value === Views.Analyse && state.selectedFilter === Filters.Comparison) {
                setState({...state, selectedView: value.target.value, selectedFilter: Filters.Y2018})
            } else {
                setState({...state, selectedView: value.target.value});
            }
        }
    }

    function changeFilter(value) {
        if (Object.values(Filters).includes(value.target.value))
            setState({...state, selectedFilter: value.target.value})
    }

    function changeStimmkreis(value) {
        setState({...state, selectedStimmkreis: value.target.innerHTML})
    }

    function changeWahlkreis(value) {
        setState({...state, selectedWahlkreis: value.target.innerHTML})
    }

    function renderView() {
        if (state.selectedFilter !== Filters.Comparison) {
            switch (state.selectedView) {
                case Views.Gesamt:
                    return <GesamtergebnisView filter={state.selectedFilter} setLoading={setLoading} useAggregates={useAggregates}/>;
                case Views.Stimmkreis:
                    return <StimmkreisView filter={state.selectedFilter} stimmkreis={state.selectedStimmkreis}
                                           stimmkreisId={stimmkreise.find(s => s.name === state.selectedStimmkreis).id}
                                           setLoading={setLoading}
                                           useAggregates={useAggregates}/>;
                case Views.Wahlkreis:
                    return <WahlkreisView filter={state.selectedFilter} wahlkreis={state.selectedWahlkreis}
                                          wahlkreisId={wahlkreise.find(s => s.name === state.selectedWahlkreis).id}
                                          setLoading={setLoading}
                                          useAggregates={useAggregates}/>;
                case Views.Analyse:
                    return <AnalyseView filter={state.selectedFilter}
                                        setLoading={setLoading}
                                        useAggregates={useAggregates}/>;
                default:
                    return <div>Not Implemented</div>
            }
        } else {
            switch (state.selectedView) {
                case Views.Stimmkreis:
                    return <VergleichStimmkreis stimmkreis={state.selectedStimmkreis}
                                                stimmkreisId={stimmkreise.find(s => s.name === state.selectedStimmkreis).id}
                                                setLoading={setLoading}
                                                useAggregates={useAggregates}/>;
                case Views.Wahlkreis:
                    return <VergleichWahlkreis wahlkreis={state.selectedWahlkreis}
                                               wahlkreisId={wahlkreise.find(s => s.name === state.selectedWahlkreis).id}
                                               setLoading={setLoading}
                                               useAggregates={useAggregates}/>;
                case Views.Gesamt:
                    return <VergleichGesamt setLoading={setLoading}
                                            useAggregates={useAggregates}/>;

                default:
                    return <div>Not Implemented</div>
            }
        }


    }

    function handleToggleAggregation(newValue) {
        if (newValue !== true && newValue !== false)
            return;
        setUseAggregates(newValue.toString());
    }

    return (
        <div className="App">
            <LoadingOverlay
                active={loading}
                spinner={<Spinner/>}
            >
                <Navbar bg="dark" variant="dark" expand="xl">
                    <Navbar.Brand href="/">{'  '}Wahlinformationssystem{'  '}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto my-sm-2 my-md-auto">
                            <ButtonGroup onClick={changeView} toggle>
                                <Button value={Views.Gesamt}
                                        active={state.selectedView === Views.Gesamt}> Gesamtergebnis</Button>
                                <Button value={Views.Wahlkreis}
                                        active={state.selectedView === Views.Wahlkreis}> Wahlkreis </Button>

                                {state.selectedView === Views.Wahlkreis &&
                                <DropdownButton as={ButtonGroup} variant="secondary" title={state.selectedWahlkreis}
                                                id="bg-nested-dropdown1"
                                                onClick={changeWahlkreis}>
                                    {wahlkreise.map(wahlkreis => {
                                        return <Dropdown.Item eventKey={wahlkreis.id}
                                                              value={wahlkreis.name}>{wahlkreis.name}</Dropdown.Item>
                                    })
                                    }
                                </DropdownButton>
                                }
                                <Button value={Views.Stimmkreis}
                                        active={state.selectedView === Views.Stimmkreis}>Stimmkreis</Button>

                                {state.selectedView === Views.Stimmkreis &&
                                <DropdownButton as={ButtonGroup} variant="secondary" title={state.selectedStimmkreis}
                                                id="bg-nested-dropdown2"
                                                onClick={changeStimmkreis}
                                                data-live-search="true">
                                    {stimmkreise.map(stimmkreis => {
                                        return <Dropdown.Item eventKey={stimmkreis.id}
                                                              value={stimmkreis.name}>{stimmkreis.name}</Dropdown.Item>
                                    })
                                    }
                                </DropdownButton>
                                }

                                <Button value={Views.Analyse}
                                        active={state.selectedView === Views.Analyse}>Analyse</Button>

                            </ButtonGroup>
                        </Nav>
                        <Nav className="mr-auto">
                            <ButtonGroup onClick={changeFilter}>
                                <Button value={Filters.Y2018} active={state.selectedFilter === Filters.Y2018}
                                        style={{whiteSpace: "nowrap"}}>Landtagswahl 2018</Button>
                                <Button value={Filters.Y2013} active={state.selectedFilter === Filters.Y2013}
                                        style={{whiteSpace: "nowrap"}}>Landtagswahl 2013</Button>
                                {(state.selectedView !== Views.Analyse) && <Button value={Filters.Comparison}
                                                                                   active={state.selectedFilter === Filters.Comparison}>Vergleich</Button>}
                            </ButtonGroup>
                        </Nav>
                        <Nav>
                            <Nav.Link disabled style={{color: "white"}}>
                                <div style={{whiteSpace: "nowrap"}}>Aggregierte Daten benutzen</div>
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <BootstrapSwitchButton checked={useAggregates === "true"} onstyle="success"
                                                   onChange={handleToggleAggregation}
                                                   />
                        </Nav>
                        <Nav className="ml-4">
                            <RefreshRoundedIcon fontSize="large" style={{color: "white"}}
                                                onClick={() => refreshViews(setLoading)}/>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <br/>

                <Fragment>
                    <div className="Content">
                        {renderView()}
                    </div>
                </Fragment>

            </LoadingOverlay>
        </div>
    )
}
