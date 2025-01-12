class apiResponse{
    constructor(statusCode,data,message="succes"){
        if(typeof statusCode!=="number" || statusCode<100 || statusCode>599){
            throw new Error("INVALID STATUS CODE")

        }
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400
    }
}
export {apiResponse}