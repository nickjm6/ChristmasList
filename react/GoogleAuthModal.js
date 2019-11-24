import React from "react"
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'

const GoogleAuthModal = (props) => {
    return (
        <Modal isOpen={props.show}>
            <ModalHeader>Sign In</ModalHeader>
            <ModalBody className="center">
                <Button color="primary" onClick={() => {window.location.href = "/auth/google/"}}>Sign In with Google</Button>
            </ModalBody>
        </Modal>
    )
}

export default GoogleAuthModal