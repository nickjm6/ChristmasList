import React, { Component } from "react"
import ReactDOM from "react-dom"

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../frontend/css/main.css"
import GiftModal from "./GiftModal"
import IdeaModal from "./IdeaModal"
import RecipientModal from "./RecipientModal"
import RecipientList from "./RecipientList"
import WhosAroundModal from './WhosAroundModal'
import GoogleAuthModal from './GoogleAuthModal'
import { Row, Col, Spinner, Button, Alert } from "reactstrap"


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            loading: true,
            showRecipientModal: false,
            showIdeaModal: false,
            showGiftModal: false,
            whosAround: [],
            message: null,
            messageType: null,
            signedIn: true,
            recipientsConfirmed: false
        }

        this.requestServer = this.requestServer.bind(this)
        this.getUserInfo = this.getUserInfo.bind(this)
        this.toggle = this.toggle.bind(this)
        this.checkWhosAround = this.checkWhosAround.bind(this)
        this.setMessage = this.setMessage.bind(this)
        this.dismissMessage = this.dismissMessage.bind(this)
    }

    setMessage(message, type){
        this.setState({message, messageType: type})
        window.scrollTo(0, 0)
    }

    dismissMessage(){
        this.setState({message: null, messageType: null})
    }

    async requestServer(endpoint, config) {
        try {
            if (config != null) {
                if (config.addUserId === true) {
                    config.addUserId = undefined;
                    let jsonBody;
                    try {
                        if (config.body != null)
                            jsonBody = JSON.parse(config.body)
                        else
                            jsonBody = {}
                    } catch (err) {
                        jsonBody = {}
                    }
                    jsonBody.userId = this.state.user._id
                    config.body = JSON.stringify(jsonBody)
                }
            }
            let res = await fetch(endpoint, config)
            let jsonRes = await res.json()
            if (jsonRes == null)
                jsonRes = {}

            if (res.status == 200) {
                return jsonRes;
            } else {
                if(res.status == 401){
                    this.setState({signedIn: false, unauthorized: true, loading: true, user: {}})
                }
                let message = jsonRes.message || jsonRes.errors || "An error occured, please check logs"
                throw new Error(message)
            }
        } catch (err) {
            console.error(err)
            throw new Error(err.message)
        }
    }

    async getUserInfo() {
        try {
            if(this.state.unauthorized)
                return
            let res = await this.requestServer(`/user/?whosAround=${this.state.whosAround}`)
            let user = res.user
            user.recipients = user.recipients || []
            let recipientsConfirmed = user.recipients.length == 0 || this.state.recipientsConfirmed
            this.setState({ user, loading: false, signedIn: true, recipientsConfirmed })
        } catch (err) {
            this.setState({signedIn: false, user: {}, loading: true, unauthorized: true})
        }
    }

    async componentDidMount() {
        this.interval = setInterval(this.getUserInfo, 500)
    }

    toggle(modalType) {
        this.dismissMessage()
         switch(modalType){
             case "gift":
                this.setState({showGiftModal: !this.state.showGiftModal})
                break;
            case "idea":
                this.setState({showIdeaModal: !this.state.showIdeaModal})
                break;
            case "recipient":
                this.setState({showRecipientModal: !this.state.showRecipientModal})
         }
    }

    checkWhosAround(whosAroundObject){
        let whosAround = Object.keys(whosAroundObject).filter(recipient => whosAroundObject[recipient] === true)
        this.setState({whosAround, loading: true, recipientsConfirmed: true })
    }

    render() {
        let user = this.state.user;
        let message = user.username ? `Welcome ${user.username}` : "Searching for user..."
        let recipients = user.recipients || []
        let {totalSpent} = user
        let showWhosAround = recipients.length > 0 && !this.state.recipientsConfirmed
        return (
            <div>
                {this.state.message ? <Alert color={this.state.messageType}>{this.state.message}</Alert> : null}
                <GoogleAuthModal show={!this.state.signedIn}></GoogleAuthModal>
                <GiftModal requestServer={this.requestServer} recipients={recipients} type="add" setMessage={this.setMessage}
                    toggle={() => this.toggle("gift")} show={this.state.showGiftModal} />
                <IdeaModal requestServer={this.requestServer} recipients={recipients} type="add" setMessage={this.setMessage}
                    toggle={() => this.toggle("idea")} show={this.state.showIdeaModal} />
                <RecipientModal requestServer={this.requestServer} type="add" setMessage={this.setMessage} 
                    toggle={() => this.toggle("recipient")} show={this.state.showRecipientModal} />
                <WhosAroundModal recipients={recipients} show={showWhosAround} confirm={this.checkWhosAround} />
                <h1 id="pageHeader">{message}</h1><br />
                <h2>So far this Christmas, you have spent ${totalSpent}</h2>
                <Row className="modalSection">
                    <Col className="modal-button" md={{ offset: 3, size: 2 }}>
                        <Button color="success" onClick={() => this.toggle("gift")}>Add Gift</Button>
                    </Col>
                    <Col className="modal-button" md="2">
                        <Button color="danger" onClick={() => this.toggle("idea")}>Add Idea</Button>
                    </Col>
                    <Col className="modal-button" md="2">
                        <Button color="success" onClick={() => this.toggle("recipient")}>Add Recipient</Button>
                    </Col>
                </Row>
                {this.state.loading || !this.state.recipientsConfirmed ? <Spinner></Spinner> :
                    <RecipientList requestServer={this.requestServer} recipients={recipients} dismissMessage={this.dismissMessage} setMessage={this.setMessage} />}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))