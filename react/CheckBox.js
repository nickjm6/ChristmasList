import React from 'react'
import { FormGroup, Input, Label } from 'reactstrap'

const CheckBox = (props) => {
    return (
        <FormGroup check>
            <Label check>
                <Input type="checkbox" name={props.name} onChange={props.checkBox} />
                {props.name}
            </Label>
        </FormGroup>
    )
}

export default CheckBox