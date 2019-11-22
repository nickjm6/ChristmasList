import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import Input from './Input'

class RecipientModal extends Component {
    constructor(props) {
        super(props);
        this.state = { requestData: {}}
        this.onInputChange = this.onInputChange.bind(this)
        this.addOrEditRecipient = this.addOrEditRecipient.bind(this)
    }

    onInputChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;
        const type = target.type
        if(type == "number")
            value = Number(value) || 0
        let requestData = this.state.requestData
        requestData[name] = value
        this.setState({requestData})
    }


    addOrEditRecipient() {
        this.props.toggle()
        let method = this.props.type == "add" ? "POST" : "PUT"
        let data = this.props.type == "add" ? this.state.requestData : {
            values: this.state.requestData,
            id: this.props.recipientId
        }
        let config = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            addUserId: this.props.type == "add"
        }
        this.props.requestServer("/recipient", config)
    }

    render() {
        let title = this.props.type == "add" ? "Add Recipient" : "Edit Recipient"
        return (
            <div>
                <Modal isOpen={this.props.show} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>Edit Recipient</ModalHeader>
                    <ModalBody>
                        <Input type="text" label="Name of recipient" name="name" onChange={this.onInputChange} />
                        <Input type="number" label="Price limit of recipient" name="priceLimit" onChange={this.onInputChange} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.props.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.addOrEditRecipient}>Submit</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default RecipientModal