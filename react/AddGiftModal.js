import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from 'reactstrap'

class addGiftModal extends Component {
    constructor(props) {
        super(props);
        this.state = { requestData: {}, modal: false }
        this.toggle = this.toggle.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
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

    render() {
        return (
            <div>
                <Button color="success" onClick={this.toggle}>Add Gift</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add Gift</ModalHeader>
                    <ModalBody>
                        <Input type="text" placeholder="Name of gift" name="name" onChange={this.onInputChange} />
                        <Input type="number" placeholder="Price of gift" name="price" onChange={this.onInputChange} />
                        <Input type="select" name="recipient" onChange={this.onInputChange}>
                            <option value={null}>No Recipient</option>
                        </Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.toggle}>Cancel</Button>
                        <Button color="primary" onClick={() => { this.toggle(); this.props.addGift(this.state.requestData) }}>Submit</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default addGiftModal