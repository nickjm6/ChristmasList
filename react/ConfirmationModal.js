import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const ConfirmationModal = (props) => {
    return (
        <Modal isOpen={props.show} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
            <ModalBody>
                Are you sure you would like to delete this item?
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={props.toggle}>No</Button>
                <Button color="danger" onClick={props.confirm}>Yes</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ConfirmationModal;