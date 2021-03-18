import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {NotificationManager} from "react-notifications";
import LoadingOverlay from "react-loading-overlay";
import {Spinner} from "./WahlErgebnisse";
import {useHistory} from "react-router-dom";
import {BASE_URL} from "../App";

export function LandingPage() {
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    async function resetData() {
        setLoading(true);
        const requestOptions = {
            method: 'POST',
        };

        try {
            const response = await fetch(BASE_URL + 'resetdata', requestOptions);
            if (response.status === 200) {
                NotificationManager.success("Datenzurücksetzen erfolgreich!");
            } else {
                NotificationManager.error("Feheler beim Datenzurücksetzen!")
            }
        } catch (err) {
            console.error(err.message);
        }
        setLoading(false);
    }

    return (
        <LoadingOverlay
            active={loading}
            spinner={<Spinner/>}
        >
            <div style={{textAlign: "center", minHeight: "1000px"}}>
                <Jumbotron>
                    <Row className="mx-auto my-auto">
                        <Col className="my-auto">
                            <h2 style={{marginBottom: "50px"}}>Bayerischer Landtag - Wahlinformationssystem</h2>
                        </Col>
                    </Row>
                    <Row className="mx-auto">
                        <Col className="my-auto">
                            <img width={"60%"} src="Flag_map_of_Bavaria.svg"/>
                        </Col>
                        <Col className="align-content-center my-auto">
                            <Row>
                                <Col>
                                    <Button size="lg" style={{margin: "25px", width: "300px"}} onClick={() => {
                                        localStorage.setItem('useAggregates', "true");
                                        history.push("/ergebnisse");
                                    }}>Statistik
                                        anzeigen</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button size="lg" style={{margin: "25px", width: "300px"}} href="/stimmabgabe">Stimme
                                        abgeben</Button>

                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                <Button size="lg" style={{margin: "25px", width: "300px"}} variant="secondary"
                                        onClick={resetData}>Daten zurücksetzen (debug)</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Jumbotron>
            </div>
        </LoadingOverlay>
)
}
