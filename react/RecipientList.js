import React, {Component} from "react"
import RecipientCard from "./RecipientCard"

import {Row, Col} from 'reactstrap'

class RecipientList extends Component {
    constructor(props){
        super(props)
        this.state = {}

        this.renderRecipients = this.renderRecipients.bind(this)
        this.renderRow = this.renderRow.bind(this)
    }

    renderRow(arr,i){
        return (
            <Row key={i} className="recipient-row">
                {arr.map(r => 
                    <Col key={r._id} md="6" className="col-card">
                        <RecipientCard requestServer={this.props.requestServer} recipient={r} recipients={this.props.recipients} />
                    </Col>
                )}
            </Row>
        )
    }

    renderRecipients(recipients){
        let numRows = Math.ceil(recipients.length / 2.0)
        let rows = []
        for(let i = 0; i < numRows; i++){
            let start = i*2
            let end = Math.min(start+2, recipients.length)
            let arr = recipients.slice(start, end)
            rows.push(arr)
        }
        return rows.map((row,i) => this.renderRow(row,i))
    }

    render(){
        let recipients = this.props.recipients
        return (
            <div id="recipientList">
                {this.renderRecipients(recipients)}
            </div>
        )
    }
}

export default RecipientList