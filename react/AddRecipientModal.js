import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import Input from './Input'

class addRecipientModal extends Component {
    constructor(props) {
        super(props);
        this.state = { requestData: {}, modal: false }
        this.toggle = this.toggle.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.addRecipient = this.addRecipient.bind(this)
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
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


    addRecipient() {
        this.toggle()
        let config = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.requestData),
            addUserId: true
        }
        this.props.requestServer("/recipient", config)
    }

    render() {
        return (
            <div>
                <Button color="success" onClick={this.toggle}>Add Recipient</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add Recipient</ModalHeader>
                    <ModalBody>
                        <Input type="text" label="Name of recipient" name="name" onChange={this.onInputChange} />
                        <Input type="number" label="Price limit of recipient" name="priceLimit" onChange={this.onInputChange} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.addRecipient}>Submit</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default addRecipientModal