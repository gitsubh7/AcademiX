export const formatData = (data) => {
    const { matchedUser} = data;
    return {
      totalSolved: matchedUser.submitStats.acSubmissionNum[0]?.count || 0,
      easySolved: matchedUser.submitStats.acSubmissionNum[1]?.count || 0,
      mediumSolved: matchedUser.submitStats.acSubmissionNum[2]?.count || 0,
      hardSolved: matchedUser.submitStats.acSubmissionNum[3]?.count || 0,
      ranking: matchedUser.profile?.ranking || null,
      
    };
  };