import React from "react"
import { Card, CardBody, CardHeader, Row, Col, Badge } from "reactstrap"
import AddGiftModal from './AddGiftModal'
import AddIdeaModal from './AddIdeaModal'
import Table from "./MyTable"
import MyTable from "./MyTable"

const RecipientCard = (props) => {
    let { recipient } = props
    let gifts = recipient.gifts || []
    let ideas = recipient.ideas || []
    let total = gifts.map(gift => gift.price).reduce((a, b) => a + b, 0).toFixed(2)
    let limit = recipient.priceLimit.toFixed(2)
    let percentDiff = Math.abs(total - limit) / (limit * 1.0)
    let color = percentDiff < .1 ? "success" : percentDiff < .15 ? "warning" : "danger"
    return (
        <Card className="card-col">
            <CardHeader>{recipient.name} (${limit})</CardHeader>
            <CardBody>
                <Row style={{ marginBottom: "20px" }}>
                    <Col md={{ offset: 2, size: 4 }}>
                        <AddGiftModal requestServer={props.requestServer} recipientId={recipient._id} color="success" />
                    </Col>
                    <Col md="4">
                        <AddIdeaModal requestServer={props.requestServer} recipientId={recipient._id} color="danger" />
                    </Col>
                </Row>
                {gifts.length > 0 ?
                    <MyTable content={gifts} contentType="Gift" title="Gifts" />
                    : null}
                {ideas.length > 0 ?
                    <MyTable content={ideas} contentType="Idea" title="Ideas" />
                    : null}
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

export default RecipientCard