import React from "react"
import {Card, CardBody, CardHeader, Row, Col} from "reactstrap"
import AddGiftModal from './AddGiftModal'
import AddIdeaModal from './AddIdeaModal'

const RecipientCard = (props) => {
    let gifts = props.gifts || []
    let ideas = props.ideas || []
    return (
        <Card>
            <CardHeader>{props.recipientName}</CardHeader>
            <CardBody>
                <Row style={{marginBottom: "20px"}}>
                    <Col md={{offset: 2, size: 4}}>
                        <AddGiftModal requestServer={props.requestServer} recipientId={props.recipientId} color="primary" />
                    </Col>
                    <Col md="4">
                        <AddIdeaModal requestServer={props.requestServer} recipientId={props.recipientId} color="info" />
                    </Col>
                </Row>
                {gifts.length > 0 ? <h3>Gifts:</h3> : null}
                {gifts.map(gift => <Row id={gift._id}>
                    <Col><p>{gift.name}</p></Col>
                    {gift.price ? <Col><p>${gift.price}</p></Col> : null}
                </Row>)}
                {ideas.length > 0 ? <h3>Ideas:</h3> : null}
                {ideas.map(idea => <Row id={idea._id}>
                    <Col><p>{idea.name}</p></Col>
                    {idea.price ? <Col><p>${idea.price}</p></Col> : null}
                </Row>)}
            </CardBody>
        </Card>
    )
}

export default RecipientCard