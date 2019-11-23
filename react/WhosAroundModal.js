import React, { Component } from "react"
import CheckBox from "./CheckBox"
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap'

class WhosAroundModal extends Component {
    constructor(props){
        super(props)
        this.state = {}
        this.checkBox = this.checkBox.bind(this)
    }

    checkBox(event){
        const {target} = event;
        const {name, checked} = target
        this.setState({[name]: checked})
    }

    render() {
        let recipients = this.props.recipients || []
        return (
            <Modal isOpen={this.props.show}>
                <ModalHeader>Who's Around?</ModalHeader>
                <ModalBody>
                    Select who is around so they can't see their gifts!
                {recipients.map(recipient => 
                    <CheckBox key={recipient._id} name={recipient.name} checkBox={this.checkBox} />
                )}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.props.confirm(this.state)}>Confirm</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default WhosAroundModal