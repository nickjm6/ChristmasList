import React from "react"
import { Table, Badge, Row, Col } from "reactstrap"
import {Icon} from "react-icons-kit"
import { bin } from "react-icons-kit/icomoon/bin"
import { edit } from "react-icons-kit/fa/edit"
import { gift } from "react-icons-kit/fa/gift"
import { plus } from "react-icons-kit/fa/plus"

const MyTable = (props) => {
    let content = props.content || []
    let isIdea = props.type == "idea"
    let title = isIdea ? "Ideas" : "Gifts"
    let contentHeader = isIdea ? "Idea" : "Gift"
    return (
        <div className="myTable">
            <h3>{title}</h3>
            <Table>
                <thead>
                    <tr>
                        <th>{contentHeader}</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map(row =>
                        <tr key={row.name}>
                            <td>
                                <h5><Badge color="success">{row.name}</Badge></h5>
                            </td>
                            <td>
                                <h5>
                                    <Badge color="danger">${row.price ? row.price.toFixed(2) : "?"}</Badge>
                                </h5>
                            </td>
                            <td>
                                <Icon icon={bin} className="icon" 
                                onClick={() => props.toggle("confirmation", props.type, {values: row, title:`Delete ${contentHeader}`})} />
                                <Icon icon={edit} className="icon" 
                                onClick={() => props.toggle(props.type, "edit", {values: row})} />
                                {isIdea ? <Icon icon={gift} className="icon" onClick={() => props.toggle("idea", "toGift", {values: row})} /> : null}
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td></td>
                        <td></td>
                        <td><Icon icon={plus} className="icon" onClick={() => props.toggle(props.type, "add")} /></td>
                    </tr>
                    <tr></tr>
                </tbody>
            </Table>
        </div>)
}

export default MyTable