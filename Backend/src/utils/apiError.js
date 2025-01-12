class apiError extends Error{
    constructor(statusCode,message="Something went wrong",errors=[],stack=""){
        if(typeof statusCode!=="number" || statusCode<100  || statusCode>599) {
            throw new Error("Invalid HTTP Status Code");
        }
        super(message);
        this.statusCode = statusCode;
        this.errors = Arrays.isArray(errors)?errors:[errors];
        if(stack) this.stack=stack
    }

}
export {apiError}