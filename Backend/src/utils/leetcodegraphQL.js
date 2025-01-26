export const query = `
query getUserProfile($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    contributions {
      points
    }
    profile {
      reputation
      ranking
    }
    submissionCalendar
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
      totalSubmissionNum {
        difficulty
        count
        submissions
      }
    }
  }
  recentSubmissionList(username: $username) {
    title
    titleSlug
    timestamp
    statusDisplay
    lang
    __typename
  }
}
`;
