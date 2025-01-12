export const asyncHandler = (fn) => async(req, res, next) =>{
    try {
        await fn(req, res, next);
    } catch (error) {
        const statusCode = typeof error.statusCode==="number" && error.status>=100 && error.statusCode<600 ? error.statusCode : 500;
        res.status(statusCode).json({
            message: error.message || "Something went wrong"
        }) 
    }
}