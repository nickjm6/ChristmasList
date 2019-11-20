import React, { Component } from "react"
import ReactDOM from "react-dom"

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../frontend/css/main.css"
import AddGiftModal from "./AddGiftModal"
import AddIdeaModal from "./AddIdeaModal"
import AddRecipientModal from "./AddRecipientModal"
import RecipientList from "./RecipientList"
import { Row, Col, Spinner } from "reactstrap"


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            loading: true
        }

        this.requestServer = this.requestServer.bind(this)
        this.addGift = this.addGift.bind(this)
        this.addIdea = this.addIdea.bind(this)
        this.addRecipient = this.addRecipient.bind(this)
        this.getUserInfo = this.getUserInfo.bind(this)
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
            console.dir(config)
            let res = await fetch(endpoint, config)
            let jsonRes = await res.json()
            if (jsonRes == null)
                jsonRes = {}

            if (res.status == 200) {
                return jsonRes;
            } else {
                let message = jsonRes.message || jsonRes.errors || "An error occured, please check logs"
                throw new Error(message)
            }
        } catch (err) {
            console.error(err)
            throw new Error("Oops, something went wrong")
        }
    }

    async getUserInfo() {
        try {
            let res = await this.requestServer("/user/byUsername?username=nickjm6")
            let user = res.user
            this.setState({ user, loading: false })
        } catch (err) {
            console.error(err)
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.getUserInfo, 500)
    }

    addGift(req) {
        req.userId = this.state.user._id
        console.dir(req)
    }

    addIdea(req) {
        req.userId = this.state.user._id
        console.dir(req)
    }

    addRecipient(req) {
        req.userId = this.state.user._id
        console.dir(req)
    }

    render() {
        let user = this.state.user;
        let message = user.username ? `Welcome ${user.username}` : "Searching for user..."
        let recipients = this.state.user.recipients || []
        let disableButtons = Object.keys(user).length == 0
        return (
            <div>
                <h1>{message}</h1><br />
                <Row>
                    <Col md={{ offset: 3, size: 2 }}>
                        <AddGiftModal requestServer={this.requestServer} recipients={recipients} addGift={this.addGift} 
                        color="success" disabled={disableButtons} />
                    </Col>
                    <Col md="2">
                        <AddIdeaModal requestServer={this.requestServer} recipients={recipients} addIdea={this.addIdea} 
                        color="primary" disabled={disableButtons} />

                    </Col>
                    <Col md="2">
                        <AddRecipientModal requestServer={this.requestServer} addRecipient={this.addRecipient} 
                        color="info" disabled={disableButtons} />
                    </Col>
                </Row>
                {this.state.loading ? <Spinner></Spinner> : 
                <RecipientList requestServer={this.requestServer} recipients={recipients}></RecipientList>}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))