
/**
* @check(object schema, object test, boolean strict=true): boolean
* Tests if <test> contains all the properties in <schema>
* Useful for verifying forms
*/
function _check(schema, test, strict=true) {
    if (strict == true) {
        if (schema.length !== test.length) return false;
    }

    const checks = Object.keys(schema).forEach(param => Object.keys(test).includes(param));
    if (checks.length !== schema.length) return false;
    else
        return true;
}

module.exports = {
    _check
}