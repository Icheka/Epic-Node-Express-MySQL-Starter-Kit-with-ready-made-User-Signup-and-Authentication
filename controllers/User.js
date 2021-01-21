const _handler = require("../_handlers/index");
const Person = require("./Person.abstract.controller");
const User_model = require('../models/User_model');
const HttpClass = require("../utils/Http.class");

// _handler._check schemas
const X_schemas = require("../_handlers/schema");
const { X_signup } = X_schemas;
class User extends Person {

    find(param, value) {
        return User_model.find(param, value, "user");
    }

    verifyEmail(email) {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return regex.test(email);
    }

    verifyPhoneNumber(number) {
        const regex = /^\+/;
        try {
            parseInt(number);
        } catch (err) {
            return false;
        }
        return regex.test(number);
    }

    async handleGeneratingUserID() {
        const id = _handler.generateRandomID(20);
        const possible_users = await this.find("user_id", id);
        if (possible_users.length > 0) return this.handleGeneratingUserID();
        return id;
    }

    getCurrentTimeStamp() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    // =======================
    //         PUBLIC 
    // =======================

    async signup(obj) {
        /*
        1. Test with _check
        2. Check if email is valid
        3. Check if email exists
        4. Encrypt password
        5. Generate user_id
        6. Insert
        */
       obj = _handler.rearrangeRequestObject(X_signup, obj);

        const Http = new HttpClass();
        // >>> {1}
        let result = _handler._validate(X_signup, obj);
        if (result['bool'] !== true) {
            // return [406, null, result];
            return [406, null, "Some parameters were unacceptable. Check that your params are up to the required lengths and are names appropriately"];
        } else {
            // checks confirmed. Can continue with normal program flow.
            // {2}
            if (this.verifyEmail(obj.email) == false) return [406, "Invalid Email", "Invalid email supplied"];
            if (this.verifyPhoneNumber(obj.phone_number) == false) return [406, "Invalid Phone Number", "Invalid phone number supplied"];
            if (this.verifyEmail(obj.nok_email) == false) return [406, "Invalid Email", "Invalid email supplied for Next-Of-Kin"];
            if (this.verifyPhoneNumber(obj.phone_number) == false) return [406, "Invalid Phone Number", "Invalid phone number supplied for Next-Of-Kin"];

            // >>> {3}
            let possible_emails = await this.find("email", obj.email);
            // console.log("POSSIBLE EMAILS: ", possible_emails);
            if (possible_emails.length > 0) {
                // email found in database
                return [409, null, "An account associated with this email already exists."];
            } else {
                // >>> {4}
                obj.password = await _handler.hash(obj.password);
                // >>> {5}
                obj.user_id = await this.handleGeneratingUserID();
                // >>> {6}
                obj.pass = obj.password;
                delete obj.password;
                obj.created_at = this.getCurrentTimeStamp();
                result = User_model.signup(obj);
                return [200, null, "Good boy!", obj];
            }

            return [200, null, "Good boy!", obj];
        }
    }
}

module.exports = new User();