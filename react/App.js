import React, { Component } from "react"
import ReactDOM from "react-dom"

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../frontend/css/main.css"



class App extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <h1>ChristmasList</h1>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))