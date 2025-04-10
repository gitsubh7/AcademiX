export const query = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    profile {
      ranking      
    }
    submitStats {
      acSubmissionNum {
        count
      }
    }
  }
  userContestRanking(username: $username) {
    rating
  }
  
}
`;
