const phone_numbers = {
    min: 10,
    max: 18
}

const emails = {
    min: 5
}

module.exports = {
    "first_name": {
        min: 2,
    },
    "last_name": {
        min: 2,
    },
    "email": emails,
    "phone_number": phone_numbers,
    "occupation": {
        min: 2,
    },
    "password": {
        min: 6,
    },
    "nationality": {
        min: 2,
        max: 3
    },
    "nok_name": {
        min: 2
    },
    "nok_phone_number": phone_numbers,
    "nok_email": emails,
    "nok_address": {
        min: 10
    },
}