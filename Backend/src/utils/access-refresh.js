import { apiError } from "../utils/apiError.js";
import {Student} from "../models/student.model.js"
export const generateAccessAndRefreshToken = async(studentId)=>{
    try {
      const student = await Student.findById(studentId);
      if(!student) throw new apiError(404,"Student not found");
      const at = student.generateAccessToken();
      const rt = student.generateRefreshToken();
      student.refreshToken = rt;
      await student.save({validateBeforeSave:false});
      return {at,rt};
    } catch (error) {
      throw new apiError(500,"Error generating tokens");
    }
}
