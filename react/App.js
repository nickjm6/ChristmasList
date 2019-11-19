import React, { Component } from "react"
import ReactDOM from "react-dom"

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../frontend/css/main.css"
import AddGiftModal from "./AddGiftModal"
import AddIdeaModal from "./AddIdeaModal"
import AddRecipientModal from "./AddRecipientModal"
import RecipientList from "./RecipientList"
import {Row, Col} from "reactstrap"


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            recipients: [{
                name: "Joe",
                _id: "1234",
                gifts: [],
                ideas: []
            },
            {
                name: "Chris",
                _id: "4312",
                gifts: [],
                ideas: []
            }]
        }

        this.requestServer = this.requestServer.bind(this)
        this.addGift = this.addGift.bind(this)
        this.addIdea = this.addIdea.bind(this)
        this.addRecipient = this.addRecipient.bind(this)
    }

    async requestServer(endpoint, config) {
        try {
            if(config != null){
                if(config.addUserId === true){
                    config.addUserId = undefined;
                    let jsonBody;
                    try{
                        if(config.body != null)
                            jsonBody = JSON.parse(config.body)
                        else 
                            jsonBody = {}
                    }catch(err){
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

    async componentDidMount() {
        try {
            let res = await this.requestServer("/user/byUsername?username=nickjm6")
            let user = res.user
            this.setState({ user })
        } catch (err) {
            console.error(err)
        }
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
        return (
            <div>
                <h1>{message}</h1><br />
                <Row>
                    <Col><AddGiftModal requestServer={this.requestServer} recipients={this.state.recipients} addGift={this.addGift}></AddGiftModal></Col>
                    <Col><AddIdeaModal requestServer={this.requestServer} recipients={this.state.recipients} addIdea={this.addIdea}></AddIdeaModal></Col>
                    <Col><AddRecipientModal requestServer={this.requestServer} addRecipient={this.addRecipient}></AddRecipientModal></Col>
                </Row>
                <RecipientList requestServer={this.requestServer} recipients={this.state.recipients}></RecipientList>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))