import React, { Component } from "react"
import { Card, CardBody, CardHeader, Row, Col, Badge } from "reactstrap"
import GiftModal from './GiftModal'
import IdeaModal from './IdeaModal'
import RecipientModal from './RecipientModal'
import ConfirmationModal from './ConfirmationModal'
import MyTable from "./MyTable"
import { Icon } from "react-icons-kit"
import { bin } from 'react-icons-kit/icomoon/bin'
import { edit } from 'react-icons-kit/fa/edit'

class RecipientCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            giftModalType: "add",
            ideaModalType: "edit",
            showGiftModal: false,
            showIdeaModal: false,
            showRecipientModal: false,
            showConfirmationModal: false,
        }
        this.toggle = this.toggle.bind(this)
        this.delete = this.delete.bind(this)
        this.dismiss = this.dismiss.bind(this)
    }

    toggle(modal, type, opts = {}) {
        let { values, title } = opts
        values = values || {}
        values.recipientId = this.props.recipient._id
        this.props.dismissMessage()
        switch (modal) {
            case "gift":
                this.setState({ giftModalType: type, showGiftModal: !this.state.showGiftModal, giftValues: values })
                break;
            case "idea":
                this.setState({ ideaModalType: type, showIdeaModal: !this.state.showIdeaModal, ideaValues: values })
                break;
            case "recipient":
                this.setState({ showRecipientModal: !this.state.showRecipientModal })
                break;
            case "confirmation":
                let deleteFunction = () => { this.delete(type, values._id) }
                this.setState({ showConfirmationModal: !this.state.showConfirmationModal, deleteTitle: title, deleteFunction })
        }
    }

    dismiss(type) {
        this.props.dismissMessage()
        switch (type) {
            case "gift":
                this.setState({ showGiftModal: false })
                break;
            case "idea":
                this.setState({ showIdeaModal: false })
                break;
            case "recipient":
                this.setState({ showRecipientModal: false })
                break;
            case "confirmation":
                this.setState({ showConfirmationModal: false })
        }
    }

    async delete(type, id) {
        this.props.dismissMessage()
        this.setState({ showConfirmationModal: false })
        let config = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id }),
            addUserId: true
        }
        let endpoint = `/${type}`
        try {
            let res = await this.props.requestServer(endpoint, config)
            let message = res.message || "Success"
            this.props.setMessage(message, "success")
        } catch (err) {
            this.props.setMessage(err.message, "danger")
        }
    }

    render() {
        let { recipient } = this.props
        let gifts = recipient.gifts || []
        let ideas = recipient.ideas || []
        let total = gifts.map(gift => gift.price).reduce((a, b) => a + b, 0).toFixed(2)
        let limit = recipient.priceLimit.toFixed(2)
        let percentDiff = Math.abs(total - limit) / (limit * 1.0)
        let color = percentDiff < .1 ? "success" : percentDiff < .15 ? "warning" : "danger"
        return (
            <Card className="card-col">
                <GiftModal requestServer={this.props.requestServer} type={this.state.giftModalType} values={this.state.giftValues}
                    show={this.state.showGiftModal} toggle={() => this.dismiss("gift")} recipients={this.props.recipients}
                    setMessage={this.props.setMessage} />
                <IdeaModal requestServer={this.props.requestServer} type={this.state.ideaModalType} values={this.state.ideaValues}
                    show={this.state.showIdeaModal} toggle={() => this.dismiss("idea")} recipients={this.props.recipients}
                    setMessage={this.props.setMessage} />
                <RecipientModal requestServer={this.props.requestServer} values={recipient} type="edit" setMessage={this.props.setMessage}
                    show={this.state.showRecipientModal} toggle={() => this.dismiss("recipient")} />
                <ConfirmationModal toggle={() => this.dismiss("confirmation")} show={this.state.showConfirmationModal}
                    confirm={this.state.deleteFunction} title={this.state.deleteTitle} />
                <CardHeader>
                    {recipient.name} (${limit})
                    <Icon className="icon header-icon"
                        onClick={() => this.toggle("confirmation", "recipient", { values: recipient, title: "Delete Recipient" })} icon={bin} />
                    <Icon className="icon header-icon" icon={edit} onClick={() => this.toggle("recipient", "edit")} />
                </CardHeader>
                <CardBody>
                    <MyTable content={gifts} type="gift" toggle={this.toggle} delete={this.delete} dismiss={this.dismiss} />
                    <MyTable content={ideas} type="idea" toggle={this.toggle} delete={this.delete} dismiss={this.dismiss} />
                    <Row>
                        <Col md={{ offset: 2, size: 8 }}>
                            <h2>
                                <Badge color={color}>Total: ${total}</Badge>
                            </h2>
                        </Col>
                    </Row>
                </CardBody>
            </Card >
        )
    }
}

export default RecipientCard