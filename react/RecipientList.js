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

    renderRow(arr){
        return (
            <Row className="recipient-row">
                {arr.map(r => 
                    <Col md="4">
                        <RecipientCard requestServer={this.props.requestServer} key={r._id} recipientId={r._id} 
                        recipientName={r.name} gifts={r.gifts || []} ideas={r.ideas || []} />
                    </Col>
                )}
            </Row>
        )
    }

    renderRecipients(recipients){
        let numRows = Math.ceil(recipients.length / 3.0)
        let rows = []
        for(let i = 0; i < numRows; i++){
            let start = i*3
            let end = Math.min(start+3, recipients.length)
            let arr = recipients.slice(start, end)
            rows.push(arr)
        }
        return rows.map(row => this.renderRow(row))
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