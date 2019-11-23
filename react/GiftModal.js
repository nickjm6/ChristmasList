import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import Input from './Input'

class GiftModal extends Component {
    constructor(props) {
        super(props);
        this.state = { requestData: {}, previouslyShowing: this.props.show == true}
        this.onInputChange = this.onInputChange.bind(this)
        this.addOrEditGift = this.addOrEditGift.bind(this)
    }

    componentDidUpdate(){
        if(this.props.show && !this.state.previouslyShowing){
            let requestData = this.props.values || {}
            let id = requestData._id
            requestData._id = undefined
            this.setState({requestData, previouslyShowing: true, id})
        } else if(!this.props.show && this.state.previouslyShowing){
            this.setState({previouslyShowing: false})
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

    addOrEditGift(){
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
            addUserId: true
        }
        this.props.requestServer("/gift", config)
    }

    render() {
        let recipients = this.props.recipients || []
        let title = this.props.type == "add" ? "Add Gift" : "Edit Gift"
        let {name, price, recipientId} = this.state.requestData
        return (
            <div>
                <Modal isOpen={this.props.show} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>{title}</ModalHeader>
                    <ModalBody>
                        <Input type="text" label="Name of gift" name="name" value={name} onChange={this.onInputChange} />
                        <Input type="number" label="Price of gift" name="price" value={price} onChange={this.onInputChange} />
                        <Input type="select" label="Recipient" name="recipientId" value={recipientId} onChange={this.onInputChange}>
                            <option value={undefined}>No Recipient</option>
                            {recipients.map(recipient =>
                                <option key={recipient._id} value={recipient._id}>{recipient.name}</option>
                            )}
                        </Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.props.toggle}>Cancel</Button>
                        <Button color="primary" onClick={this.addOrEditGift}>Submit</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default GiftModal