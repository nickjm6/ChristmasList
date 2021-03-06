const ObjectId = require("mongoose").Types.ObjectId

module.exports = (fields) => (req, res, next) => {
    let result = {}
    let values = req.body.values
    if(values === undefined || values === null || typeof values !== "object" || Array.isArray(values)){
        values = {}
    }
    let fieldList = Object.keys(fields)
    for(let i = 0; i < fieldList.length; i++){
        let field = fieldList[i]
        let value = values[field]
        let type = fields[field]
        if(value === null || value === undefined)
            continue;
        if(type == "object" && Array.isArray(value))
            continue
        if(typeof value === type || (type == "array" && Array.isArray(value))){
            result[field] = value;
            continue
        }
        if(type == "number"){
            value = Number(value)
            if(!isNaN(value))
                result[field] = value
        } else if(type == "objectid") {
            if(value instanceof ObjectId){
                result[field] = value
            } else {
                try{
                    result[field] = ObjectId(value)
                }catch(err){}
            }
        } 
    }
    req.body.values = result;
    next()
}