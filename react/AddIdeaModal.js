import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import Input from './Input'

class addIdeaModal extends Component {
    constructor(props) {
        super(props);
        this.state = { requestData: {}, modal: false }
        this.toggle = this.toggle.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.addIdea = this.addIdea.bind(this)
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
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

    componentDidMount() {
        if (this.props.recipientId)
            this.setState({ requestData: { recipientId: this.props.recipientId } })
    }

    addIdea() {
        this.toggle()
        let config = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.requestData),
            addUserId: true
        }
        this.props.requestServer("/idea", config)
    }

    render() {
        let recipients = this.props.recipients || []
        return (
            <div>
                <Button color="success" onClick={this.toggle}>Add Idea</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add Idea</ModalHeader>
                    <ModalBody>
                        <Input type="text" label="Name of idea" name="name" onChange={this.onInputChange} />
                        <Input type="number" label="Price of idea (optional)" name="price" onChange={this.onInputChange} />
                        {this.props.recipientId == null ? <Input type="select" label="Recipient" name="recipientId" onChange={this.onInputChange}>
                            <option value={null}>No Recipient</option>
                            {recipients.map(recipient =>
                                <option key={recipient._id} value={recipient._id}>{recipient.name}</option>
                            )}
                        </Input> : null
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.addIdea}>Submit</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default addIdeaModal