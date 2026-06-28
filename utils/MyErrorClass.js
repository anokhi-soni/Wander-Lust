class MyError extends Error{ // Error is the Default Error class of Express
    constructor(status, message){
        super();
        this.status = status;
        this.message = message;
    }
}

module.exports = MyError; 