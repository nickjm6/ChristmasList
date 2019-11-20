const ObjectId = require("mongoose").Types.ObjectId

module.exports = (fields) => (req, res, next) => {
    let fieldList = Object.keys(fields)
    let body = req.method === "GET" ? req.query : req.body
    let errors = []
    for (let i = 0; i < fieldList.length; i++) {
        let field = fieldList[i]
        let type = fields[field]
        let value = body[field]
        if (value == null) {
            errors.push(`Missing field: ${field}`)
            continue
        }
        if (type == "array" && !Array.isArray(value)) {
            errors.push(`Invalid type for field: ${field}. Expected 'array' but got 'object'`)
            continue;
        }
        if (type == "object" && Array.isArray(value)) {
            errors.push(`Invalid type for field: ${field}. Expected 'object' but got 'array'`)
            continue;
        }
        if (type == "objectid") {
            if (typeof value != "string") {
                errors.push(`Invalid type for field: ${field}. Expected 'objectid' but got ${typeof value}`)
                continue;
            }
            try{
                let objId = ObjectId(value)
                body[field] = objId
                continue
            } catch(err){
                errors.push(`Invalid format for objectId for field: ${field}`)
                continue
            }
        }
        if (typeof value !== type) {
            errors.push(`Invalid type for field: ${field}. Expected '${type}' but got '${typeof value}'`)
        }
    }
    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        next()
    }
}