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


    addOrEditIdea() {
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
        this.props.requestServer(endpoint, config)
    }

    render() {
        let recipients = this.props.recipients || []
        let title = this.props.type == "add" ? "Add Idea" : this.props.type == "edit" ? "Edit Idea" : "Turn gift into idea"
        let priceLabel = this.props.type == "toGift" ? "Price" : "Price (Optional)"
        let {name, price, recipientId} = this.state.requestData
        return (
            <div>
                <Modal isOpen={this.props.show} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>{title}</ModalHeader>
                    <ModalBody>
                        {this.props.type == "toGift" ? "Update any values before turning into a gift. Remeber price is required for a gift" : null}
                        <Input type="text" label="Name of idea" name="name" value={name} onChange={this.onInputChange} />
                        <Input type="number" label={priceLabel} value={price} name="price" onChange={this.onInputChange} />
                        <Input type="select" label="Recipient" name="recipientId" value={recipientId} onChange={this.onInputChange}>
                            <option value={undefined}>No Recipient</option>
                            {recipients.map(recipient =>
                                <option key={recipient._id} value={recipient._id}>{recipient.name}</option>
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