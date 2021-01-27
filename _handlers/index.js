const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const _Error = require("./_Error.class");

// _handler configs 
const _handler = require("../_handlers/config");


class _Handler {
    constructor() {
        this._error = _Error;
    }

    generateRandomID(len) {
        return Math.random().toString(36).substr(2, len);
    }

    async hash(password) {
        return await bcrypt.hash(password, parseInt(process.env.SALT))
    }

    async compare_passwords(password, hashed) {
        return await bcrypt.compare(password, hashed);
    }

    rearrangeRequestObject(model, obj) {
        let tmp_obj = {};
        Object.keys(model).forEach(param => {
            tmp_obj[param] = obj[param];
        });
        return tmp_obj;
    }

    _validate(schema, test, strict=true) {
        /**
         * 
         * 
        */
        this.messages = {
            0: { bool: false, code: 0, status: "LENGTHS MUST BE EQUAL" },
            1: { bool: false, code: 1, status: "VALUES MUST BE WITHIN THEIR RANGE" },
            1000: { bool: true, code: 1000 },
        }

        this.schema = schema;
        this.test = test;
        this.schema_keys = Object.keys(schema);
        this.test_keys = Object.keys(test);

        if (strict == true) {
            if (this.schema_keys.length !== this.test_keys.length) {
                // failed
                return this.messages[0];
            }
        }

        for (let i = 0; i < this.schema_keys.length; i++) {
            if (!this.isWithinRange(test, i)) {
                return this.messages[1];
            }
        }

        return this.messages[1000];
    }

    isWithinRange(test, i) {
        let check_min = this.isUpToMin(test[this.test_keys[i]].length, this.schema[this.schema_keys[i]].min);
        let check_max = this.isWithinMax(test[this.test_keys[i]].length, (this.schema[this.schema_keys[i]].max || 1000000));

        return (!!check_min && !!check_max);
    }

    isUpToMin(test, min) {
        return test >= min;
    }

    isWithinMax(test, max) {
        return test <= max;
    }
}

module.exports = new _Handler();