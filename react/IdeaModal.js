import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import Input from './Input'

class IdeaModal extends Component {
    constructor(props) {
        super(props);
        this.state = { requestData: {} }
        this.onInputChange = this.onInputChange.bind(this)
        this.addOrEditIdea = this.addOrEditIdea.bind(this)
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

    addOrEditIdea() {
        this.props.toggle()
        let method = this.props.type == "add" ? "POST" : "PUT"
        let data = this.props.type == "add" ? this.state.requestData : {
            values: this.state.requestData,
            id: this.props.ideaId
        }
        let config = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            addUserId: true
        }
        this.props.requestServer("/idea", config)
    }

    render() {
        let recipients = this.props.recipients || []
        let title = this.props.type == "add" ? "Add Idea" : "Edit Idea"
        return (
            <div>
                <Modal isOpen={this.props.show} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>{title}</ModalHeader>
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
                        <Button color="danger" onClick={this.props.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.addOrEditIdea}>Submit</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default IdeaModal