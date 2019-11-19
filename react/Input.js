import React from "react"

import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'

let MyInput = (props) => {
    return (
        <InputGroup className="myInput">
            <InputGroupAddon addonType="prepend">
                <InputGroupText>{props.label}</InputGroupText>
            </InputGroupAddon>
            <Input type={props.type} name={props.name} id={props.id} className={props.className} onChange={props.onChange}>{props.children}</Input>
        </InputGroup>
    )
}

export default MyInput