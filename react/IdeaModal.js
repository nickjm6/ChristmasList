import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap'
import Input from './Input'

class IdeaModal extends Component {
    constructor(props) {
        super(props);
        this.state = { requestData: {}, errors: [] }
        this.onInputChange = this.onInputChange.bind(this)
        this.addOrEditIdea = this.addOrEditIdea.bind(this)
        this.validateRequest = this.validateRequest.bind(this)
        this.addError = this.addError.bind(this)
        this.dismissErrors = this.dismissErrors.bind(this)
    }

    addError(message) {
        let { errors } = this.state
        errors.push(message)
        this.setState({ errors })
    }

    dismissErrors() {
        return new Promise(resolve => this.setState({ errors: [] }, resolve))
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

    validateRequest() {
        let req = this.state.requestData
        let clean = true;
        if (!req.name) {
            this.addError("Please enter a name for the idea")
            clean = false
        }
        if(req.price == null && this.props.type == "toGift"){
            this.addError("Please enter a value for gift (hint: 0 is a value)")
            clean = false
        }
        return clean;
    }

    async addOrEditIdea() {
        await this.dismissErrors()
        let clean = this.validateRequest()
        if (!clean)
            return
        this.props.toggle()
        let method = this.props.type == "add" || this.props.type == "toGift" ? "POST" : "PUT"
        let data = this.props.type == "add" ? this.state.requestData : {
            values: this.state.requestData,
            id: this.state.id
        }
        let endpoint = this.props.type == "toGift" ? "/idea/makeGift" : "/idea"
        let config = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            addUserId: this.props.type == "add"
        }
        try {
            let res = await this.props.requestServer(endpoint, config)
            let message = res.message || "Success"
            this.props.setMessage(message, "success")
        } catch (err) {
            this.props.setMessage(err.message, "danger")
        }
    }

    render() {
        let recipients = this.props.recipients || []
        let title = this.props.type == "add" ? "Add Idea" : this.props.type == "edit" ? "Edit Idea" : "Turn idea into gift"
        let priceLabel = this.props.type == "toGift" ? "Price" : "Price (Optional)"
        let { name, price, recipientId } = this.state.requestData
        return (
            <div>
                <Modal isOpen={this.props.show} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>{title}</ModalHeader>
                    <ModalBody>
                        {this.state.errors.map(error => <Alert key={error} color="danger">{error}</Alert>)}
                        {this.props.type == "toGift" ? "Update any values before turning into a gift" : null}
                        <Input type="text" label="Name of idea" name="name" value={name} onChange={this.onInputChange} />
                        <Input type="number" label={priceLabel} value={price} name="price" onChange={this.onInputChange} />
                        <Input type="select" label="Recipient" name="recipientId" value={recipientId} onChange={this.onInputChange}>
                            <option value={undefined}>No Recipient</option>
                            {recipients.map((recipient, i) =>
                                <option key={i} value={recipient._id}>{recipient.name}</option>
                            )}
                        </Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.props.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.addOrEditIdea}>Submit</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default IdeaModal