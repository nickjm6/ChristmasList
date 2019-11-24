import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap'
import Input from './Input'

class RecipientModal extends Component {
    constructor(props) {
        super(props);
        this.state = { requestData: {}, errors: [] }
        this.onInputChange = this.onInputChange.bind(this)
        this.addOrEditRecipient = this.addOrEditRecipient.bind(this)
        this.addError = this.addError.bind(this)
        this.dismissErrors = this.dismissErrors.bind(this)
        this.validateRequest = this.validateRequest.bind(this)
    }

    addError(message) {
        let { errors } = this.state
        errors.push(message)
        this.setState({ errors })
    }

    dismissErrors() {
        return new Promise(resolve => {this.setState({ errors: []}, resolve)})
    }

    componentDidUpdate() {
        if (this.props.show && !this.state.previouslyShowing) {
            let requestData = this.props.values || {}
            let id = requestData._id
            requestData._id = undefined
            this.setState({ requestData, previouslyShowing: true, id })
        } else if (!this.props.show && this.state.previouslyShowing) {
            this.setState({ previouslyShowing: false })
        }
    }


    onInputChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;
        const type = target.type
        if (type == "number")
            value = Number(value) || 0
        let requestData = this.state.requestData
        requestData[name] = value
        this.setState({ requestData })
    }

    validateRequest() {
        let clean = true;
        let req = this.state.requestData;
        if (!req.name) {
            this.addError("Please enter a name for the recipient")
            clean = false
        }
        if (!req.priceLimit) {
            this.addError("Please enter a price limit for the recipient")
            clean = false;
        }
        return clean
    }

    async addOrEditRecipient() {
        await this.dismissErrors()
        let goodRequest = this.validateRequest()
        if (!goodRequest)
            return
        this.props.toggle()
        let method = this.props.type == "add" ? "POST" : "PUT"
        let data = this.props.type == "add" ? this.state.requestData : {
            values: this.state.requestData,
            id: this.state.id
        }
        let config = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            addUserId: this.props.type == "add"
        }
        try {
            let res = await this.props.requestServer("/recipient", config)
            let message = res.message || "Success"
            console.dir(res)
            this.props.setMessage(message, "success")
        } catch (err) {
            this.props.setMessage(err.message, "danger")
        }
    }

    render() {
        let title = this.props.type == "add" ? "Add Recipient" : "Edit Recipient"
        let { name, priceLimit } = this.state.requestData
        return (
            <div>
                <Modal isOpen={this.props.show} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>{title}</ModalHeader>
                    <ModalBody>
                        {this.state.errors.map(error => <Alert key={error} color="danger">{error}</Alert>)}
                        <Input type="text" label="Name of recipient" name="name" value={name} onChange={this.onInputChange} />
                        <Input type="number" label="Price limit of recipient" name="priceLimit" value={priceLimit} onChange={this.onInputChange} />
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