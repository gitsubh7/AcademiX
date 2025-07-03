import { Student } from "../models/student.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiResponse} from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js";
import axios from "axios"
import { formatData } from "../utils/leetcodedataformat.js";
import { query } from "../utils/leetcodegraphQL.js";
import { Coding } from "../models/codings.model.js";


export const getGithubProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const url = `https://api.github.com/users/${username}`;

    const response = await axios.get(url);
    if (!response.data) throw new apiError(404, "GitHub profile not found");


    const reposResponse = await axios.get(response.data.repos_url);
    const repositories = reposResponse.data;

    let commits = 0;

    for (const repo of repositories) {
      try {
        const commitResponse = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/commits`);
        commits += commitResponse.data.length;
      } catch (err) {
        console.error(`Error fetching commits for repo: ${repo.name}`);
      }
    }
    const profile = {
      username: response.data.login,
      name: response.data.name,
      bio: response.data.bio,
      followers: response.data.followers,
      following: response.data.following,
      public_repos: response.data.public_repos,
      commits: commits,
    };

    res.status(200).json(new apiResponse(200, "GitHub profile fetched successfully", profile));
  
});
export const getCodeforcesProfile=asyncHandler(async(req,res,next)=>{
  const {username} = req.params
  const url = `https://codeforces.com/api/user.info?handles=${username}`
  
  const response = (await axios.get(url)).data.result[0];
  
  const profile = {
    username: response.handle,
    rating: response.rating,
    maxRating: response.maxRating,
    rank: response.rank,
    maxRank: response.maxRank,

  }
  const studentId = req.user._id;
  const student = await Student.findById(studentId);

  const existingProfile = await Coding.findOne({ roll_number: student.roll_number, platform: "codeforces" });
  if (existingProfile) {
    // Update the existing profile
    existingProfile.questions_solved = 0;
    existingProfile.contest_rating = profile.rating;
    await existingProfile.save();
  } else {
    // Create a new profile
    await Coding.create({
      name:student.name,
      image_url:student.image_url,
      roll_number:student.roll_number,
      questions_solved:0,
      contest_rating:profile.rating,
      platform:"codeforces"
    })
  }
  

  
  res.status(200).json(new apiResponse(200,"Codeforces profile fetched successfully",profile));
})


export const getLeetCodeProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const result = await axios.post(
    'https://leetcode.com/graphql',
    {
      query,
      variables: { username },

    },
    {
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com/',
      },
    }
    

  );

  if (!result.data) throw new apiError(404, "LeetCode profile not found");
  
  const profile = formatData(result.data.data);
  
  const questions_solved= profile.totalSolved;
  const rating = profile.ranking;
  const student = await Student.findById(req.user._id);
  if(!student) throw new apiError(404,"Student not found");
  
  const existingProfile = await Coding.findOne({ roll_number: student.roll_number, platform: "leetcode" });

  
  if (existingProfile) {
    existingProfile.questions_solved = questions_solved;
    existingProfile.contest_rating = rating;
    await existingProfile.save();
  } else {
    // Create a new profile    
    await Coding.create({
      name:student.name,
      image_url:student.image_url,
      roll_number:student.roll_number,
      questions_solved:questions_solved,
      contest_rating:rating,
      platform:"leetcode"
    })
  }
  

  res.status(200).json(new apiResponse(200, "LeetCode profile fetched successfully", profile));
  
});

export const getCodeForcesRankings = asyncHandler(async (req, res, next) => {
  const rankings = await Coding.aggregate([
    { $match: { platform: "codeforces" } },
    { $sort: { contest_rating: -1 } }
  ]);

  res.status(200).json(new apiResponse(200, "Codeforces rankings fetched successfully", rankings));
  
})
export const getLeetCodeRankingsC = asyncHandler(async (req, res, next) => {
  const rankings = await Coding.aggregate([
    { $match: { platform: "leetcode" } },
    { $sort: { contest_rating: -1 } }
  ]);

  res.status(200).json(new apiResponse(200, "LeetCode rankings fetched successfully", rankings));
})

export const getLeetCodeRankingsQ = asyncHandler(async (req, res, next) => {
  const rankings = await Coding.aggregate([
    { $match: { platform: "leetcode" } },
    //sort based on number of questions
    { $sort: { questions_solved: -1 } }
  ]);

  res.status(200).json(new apiResponse(200, "LeetCode rankings fetched successfully", rankings));
})
