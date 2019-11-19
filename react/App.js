import React, { Component } from "react"
import ReactDOM from "react-dom"

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../frontend/css/main.css"
import AddGiftModal from "./AddGiftModal"



class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {}
        }

        this.requestServer = this.requestServer.bind(this)
        this.addGift = this.addGift.bind(this)
    }

    async requestServer(endpoint, config) {
        try {
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

    addGift(req){
        req.userId = this.state.user._id
        console.dir(req)
    }

    render() {
        let user = this.state.user;
        let message = user.username ? `Welcome ${user.username}` : "Searching for user..."
        return (
            <div>
                <h1>{message}</h1><br/>
                <AddGiftModal addGift={this.addGift}></AddGiftModal>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))