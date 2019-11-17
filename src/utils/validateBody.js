module.exports = (fields) => (req, res, next) => {
    let fieldList = Object.keys(fields)
    let body = req.method === "GET" ? req.query : req.body
    let errors = []
    for(let i = 0; i < fieldList.length; i++){
        let field = fieldList[i]
        let type = fields[field]
        let value = body[field]
        if(value === null || value === undefined){
            errors.push(`Missing field: ${field}`)
            continue
        } 
        if(type == "array" && !Array.isArray(value)){
            errors.push(`Invalid type for field: ${field}. Expected 'array' but got 'object'`)
            continue;
        }
        if(type == "object" && Array.isArray(value)){
            errors.push(`Invalid type for field: ${field}. Expected 'object' but got 'array'`)
            continue;
        }
        if(typeof value !== type){
            errors.push(`Invalid type for field: ${field}. Expected '${type}' but got '${typeof value}'`)
        }
    }
    if(errors.length > 0){
        res.status(400).json({errors});
    } else{
        next()
    }
}