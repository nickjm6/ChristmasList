import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import Input from './Input'
import { request } from 'http';

class RecipientModal extends Component {
    constructor(props) {
        super(props);
        this.state = { requestData: {}}
        this.onInputChange = this.onInputChange.bind(this)
        this.addOrEditRecipient = this.addOrEditRecipient.bind(this)
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
        this.props.requestServer("/recipient", config)
    }

    render() {
        let title = this.props.type == "add" ? "Add Recipient" : "Edit Recipient"
        let {name, priceLimit} = this.state.requestData
        return (
            <div>
                <Modal isOpen={this.props.show} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>{title}</ModalHeader>
                    <ModalBody>
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