import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import {Form} from "react-bootstrap"
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {NotificationManager} from 'react-notifications';
import {BASE_URL} from "../App";

export function Stimmabgabe() {
    const [tokenValidated, setTokenValidated] = useState(false);
    const [tokenInvalid, setTokenInvalid] = useState(false);
    const [token, setToken] = useState("");

    const [direktkandidaten, setDirektkandidaten] = useState([]);
    const [listenkandidaten, setListenkandidaten] = useState([]);
    const [wahlkreis, setWahlkreis] = useState([]);
    const [stimmkreis, setStimmkreis] = useState([]);

    const [gewaehlterErstkID, setGewaehlterErstkID] = useState(-1);
    const [gewaehltePartei, setGewaehltePartei] = useState(-1);
    const [gewaehlterZweitkID, setGewaehlterZweitID] = useState(-1);

    const [invalidErst, setInvalidErst] = useState(false);
    const [invalidZweit, setInvalidZweit] = useState(false);


    async function onSubmitToken(event) {
        event.preventDefault();

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        };
        try {
            const response = await fetch(BASE_URL + 'wahlzettel', requestOptions);
            if (response.status === 200) {
                const jsonData = await response.json();
                setTokenInvalid(false);
                setStimmkreis(jsonData.stimmkreis);
                setWahlkreis(jsonData.wahlkreis);
                setDirektkandidaten(jsonData.direktkandidaten);
                setListenkandidaten(jsonData.listenkandidaten);
                setTokenValidated(true);
            } else {
                setTokenInvalid(true)
            }

        } catch (err) {
            console.error(err.message);
        }

    }

    async function OnSubmitVote(event) {
        event.preventDefault();

        if ( !window.confirm('Stimmabgabe bestätigen?') ) {
            return;
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                erststimme: (gewaehlterErstkID === -1 && !invalidErst) ? null : {
                    kandidatur_id: gewaehlterErstkID === -1 ? null : parseInt(gewaehlterErstkID),
                    ungultig: invalidErst,
                },
                zweitstimme: (gewaehltePartei === -1 && !invalidZweit) ? null :
                    {
                        kandidatur_id: gewaehlterZweitkID === -1 ? null : parseInt(gewaehlterZweitkID),
                        partei: gewaehltePartei === -1 ? null : gewaehltePartei,
                        ungultig: invalidZweit
                    }
            })
        };

        try {
            const response = await fetch(BASE_URL + 'stimmabgabe', requestOptions);
            if (response.status === 200) {
                NotificationManager.success("Stimme erfolgreich abgegeben");
                setTokenValidated(false);
                setToken("");
                setGewaehltePartei(-1);
                setGewaehlterErstkID(-1);
                setGewaehlterZweitID(-1)
            } else {
                NotificationManager.error("Fehler in der stimmabgabe")
            }
        } catch (err) {
            console.error(err.message);
        }

    }

    function renderTokenEntry() {
        return (
            <div>
                <Card style={{width: '25rem'}}>
                    <Card.Body>
                        <Form onSubmit={onSubmitToken}>
                            <Form.Group controlId="tokenform">
                                <Form.Label>Token eingeben</Form.Label>
                                <Form.Control required type="text" placeholder="Beispiel: AAAA-1234-BBBB-5678"
                                              value={token} onChange={(event) => {
                                    setToken(event.target.value);
                                    setTokenInvalid(false)
                                }}
                                              isInvalid={tokenInvalid}/>
                                <Form.Control.Feedback type="invalid">
                                    Token ist ungültig!
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="buttonBar clearfix">
                                <Button className="button float-right" id="submit-button" variant="primary"
                                        type="submit">
                                    Submit
                                </Button>
                                <Button className="button float-right mx-2" variant="secondary" href="/">Cancel</Button>
                            </div>

                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    function renderStimmzettel() {
        return (<div>
                <Card style={{width: '70rem'}}>
                    <Card.Body>
                        <Form style={{width: "100%"}} onSubmit={OnSubmitVote}>
                            <Form.Row>
                                <Col className="mx-4">
                                    <h2>Erststimme</h2>
                                    <p><h5 style={{color: 'grey'}}>Stimmkreis: {stimmkreis.name}</h5></p>
                                    <Form.Group controlId="diretkandidatform">
                                        <Form.Label>Wählen Sie einen Direktkandidaten:</Form.Label>
                                        <Form.Control as="select"
                                                      disabled={invalidErst}
                                                      custom
                                                      value={gewaehlterErstkID}
                                                      onChange={newValue => {
                                                          console.log(newValue.target.value);
                                                          setGewaehlterErstkID(newValue.target.value)
                                                      }
                                                      }>
                                            <option value={-1}>Kein Kandidat ausgewählt</option>
                                            {direktkandidaten.map(ek => {
                                                return (
                                                    <option
                                                        value={ek.kandidatur_id}>{ek.vorname + " " + ek.nachname + " (" + ek.partei + ")"}</option>
                                                )
                                            })}
                                        </Form.Control>

                                    </Form.Group>
                                </Col>
                                <Col className="mx-4">
                                    <h2>Zweitstimme</h2>
                                    <p><h5 style={{color: 'grey'}}>Wahlkreis: {wahlkreis.name}</h5></p>
                                    <Form.Group controlId="parteiform">
                                        <Form.Label>Wählen Sie eine Partei:</Form.Label>
                                        <Form.Control as="select"
                                                      disabled={invalidZweit}
                                                      custom
                                                      value={gewaehltePartei}
                                                      onChange={newValue => {
                                                          setGewaehltePartei(newValue.target.value)
                                                      }
                                                      }>
                                            <option value={-1}>Keine Partei ausgewählt</option>
                                            {listenkandidaten.map(lk => {
                                                return (
                                                    <option
                                                        value={lk.partei}>{lk.partei}</option>
                                                )
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                    {gewaehltePartei !== -1 &&
                                    <Form.Group controlId="zweitkandidatForm">
                                        <Form.Label>Wählen Sie einen Listenkandidaten:</Form.Label>
                                        <Form.Control as="select"
                                                      disabled={invalidZweit}
                                                      value={gewaehlterZweitkID}
                                                      onChange={newValue => {
                                                          console.log(newValue.target.value);
                                                          setGewaehlterZweitID(newValue.target.value)
                                                      }
                                                      }>
                                            <option value={-1}>Stimme ohne Listenkandidat</option>
                                            {listenkandidaten.find(lk => {
                                                return lk.partei === gewaehltePartei
                                            })?.kandidaten.map(lk => {
                                                return (
                                                    <option
                                                        value={lk.kandidatur_id}>{lk.listenplatz}. {lk.vorname} {lk.nachname} </option>
                                                )
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                    }
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col className="mx-4">
                                    <Form.Group as={Row} controlId="formHorizontalCheck">
                                        <Col>
                                            <Form.Check label="Ungültige Erststimme abgeben" value={invalidErst}
                                                        onChange={() => {
                                                            setInvalidErst(!invalidErst);
                                                            setGewaehlterErstkID(-1);
                                                        }}/>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col className="mx-4">
                                    <Form.Group as={Row} controlId="formHorizontalCheck">
                                        <Col>
                                            <Form.Check label="Ungültige Zweitstimme abgeben" value={invalidZweit}
                                                        onChange={() => {
                                                            setInvalidZweit(!invalidZweit);
                                                            setGewaehlterZweitID(-1);
                                                            setGewaehltePartei(-1);
                                                        }}/>
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Form.Row>

                            <Form.Row>
                                <div className="buttonBar clearfix mx-auto">
                                    <Button className="button" id="submit-button" variant="primary"
                                            type="submit">
                                        Submit
                                    </Button>
                                    <Button className="button mx-2" variant="secondary"
                                            href="/">Cancel</Button>
                                </div>
                            </Form.Row>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    return (
        <div className="centerVertically">
            {tokenValidated ?
                renderStimmzettel()
                : renderTokenEntry()}
        </div>
    )
}
