import React from "react"
import { Table, Badge } from "reactstrap"

const MyTable = (props) => {
    let content = props.content || []
    return (
        <div className="myTable">
            <h3>{props.title}</h3>
            <Table>
                <thead>
                    <tr>
                        <th>{props.contentType}</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map(row =>
                        <tr key={row.name}>
                            <td><h5><Badge color="success">{row.name}</Badge></h5></td>
                            <td><h5><Badge color="danger">${row.price ? row.price.toFixed(2) : "?"}</Badge></h5></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>)
}

export default MyTable