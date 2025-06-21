import { useState, useCallback, useEffect } from "react"; 

import { fetchLeetCode, fetchGitHub, fetchCodeforces ,getLeetRankByQuestions,
  getLeetRankByRating,
  getCFRankings } from "../api";
  import { RefreshCw } from "lucide-react";  
// … your logo imports
import Leet from "../assets/Leet.png";
import Gitlogo from"../assets/Gitlogo.jpeg";
import Code from "../assets/Code.png";

const CodingProfiles = () => {
  const [leetData, setLeetData]             = useState(null);
  const [githubData, setGithubData]         = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [loading, setLoading]               = useState({});   // keeps track of fetches
  const [leetRankByQ, setLeetRankByQ] = useState([]);
  const [leetRankByR, setLeetRankByR] = useState([]);
  const [codeforcesRank, setCodeforcesRank] = useState([]);
  const [lbLoading, setLbLoading] = useState({   // ⬅️ NEW: per-leaderboard spinner
    leetQ: false,
    leetR: false,
    cf: false,
  }); 

  const LS_KEY = "codingProfiles.usernames";

const saveUsernames = (obj) => {
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
};

const loadUsernames = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {
      LeetCode: "",
      GitHub: "",
      Codeforces: "",
    };
  } catch {
    return { LeetCode: "", GitHub: "", Codeforces: "" };
  }
};


 const [usernames, setUsernames] = useState(loadUsernames());

    
  /** fetch on demand, per‑platform ------------------------------------- */
  const handleFetch = useCallback(async platform => {
    const username = usernames[platform];
    if (!username) return;

    setLoading(prev => ({ ...prev, [platform]: true }));

    try {
      if (platform === "LeetCode") {
        const { data} = await fetchLeetCode(username);
        console.log("RAW response ➜", data);
        setLeetData(data.message);
      } else if (platform === "GitHub") {
        const { data } = await fetchGitHub(username);
        setGithubData(data.message);
      } else if (platform === "Codeforces") {
        const { data } = await fetchCodeforces(username);
        setCodeforcesData(data.message);
      }
    } catch (err) {
      console.error(err);
      // optional: surface “username not found” or auth error here
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  }, [usernames]);

  const refreshLeaderboard = async (which) => {
    setLbLoading((p) => ({ ...p, [which]: true }));
    try {
      if (which === "leetQ") {
        const res = await getLeetRankByQuestions();
        setLeetRankByQ(res.data.message);
      } else if (which === "leetR") {
        const res = await getLeetRankByRating();
        setLeetRankByR(res.data.message);
      } else {
        const res = await getCFRankings();
        setCodeforcesRank(res.data.message);
      }
    } catch (err) {
      console.error("Leaderboard fetch failed:", err);
    } finally {
      setLbLoading((p) => ({ ...p, [which]: false }));
    }
  };

  /** helper so each input only changes its own value ------------------- */
  const updateName = (platform, value) => {
  setUsernames((prev) => {
    const next = { ...prev, [platform]: value };
    saveUsernames(next);          // 👈 write to storage
    return next;
  });
};
  const symbolForRank = (idx) =>
    idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`;

  /** ------------------------------------------------------------------- */
  useEffect(() => {
  (async () => {
    try {
      const [leetQ, leetR, cf] = await Promise.all([
        getLeetRankByQuestions(),
        getLeetRankByRating(),
        getCFRankings(),
      ]);
      setLeetRankByQ(leetQ.data.message);
      setLeetRankByR(leetR.data.message);
      setCodeforcesRank(cf.data.message);
    } catch (err) {
      console.error("Leaderboard fetch failed:", err);
    }
  })();
}, []);

useEffect(() => {
  // kick off fetches for whichever usernames are already stored
  ["LeetCode", "GitHub", "Codeforces"].forEach((p) => {
    if (usernames[p]) handleFetch(p);
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);   

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Coding Profiles</h2>

      <div className=" mb-10">
        <div className="flex justify-center gap-6">
          {[
            { img: Leet, name: "LeetCode" },
            { img: Gitlogo, name: "GitHub" },
            { img: Code, name: "Codeforces" },
          ].map(p => (
            <div
              key={p.name}
              className="bg-[#202060] text-white rounded-xl p-4 w-52 text-center shadow-lg"
            >
              {/* logo */}
              <img
                src={p.img}
                alt={p.name}
                className="w-20 h-20 mx-auto mb-4 object-contain"
              />

              {/* username input */}
              <input
                type="text"
                placeholder="Enter your username"
                value={usernames[p.name]}
                onChange={e => updateName(p.name, e.target.value)}
                onBlur={() => handleFetch(p.name)}          // auto‑fetch on blur
                onKeyDown={e => e.key === "Enter" && e.target.blur()}
                className="mt-1 mb-4 w-full rounded-lg px-3 py-2 text-sm text-white
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              {/* stats or spinner */}
              {loading[p.name] ? (
                <p className="text-sm italic">Loading…</p>
              ) : p.name === "LeetCode" ? (
                <div className="text-sm space-y-1">
                  <p>Questions Solved: {leetData?.totalSolved ?? "—"}</p>
                 <p>Ranking: {leetData ? Math.floor(leetData.ranking) : "—"}</p>

                </div>
              ) : p.name === "GitHub" ? (
                <div className="text-sm space-y-1">
                  <p>Public Repos: {githubData?.public_repos ?? "—"}</p>
                  <p>Total Commits: {githubData?.commits ?? "—"}</p>
                  <p>Followers: {githubData?.followers ?? "—"}</p>
                </div>
              ) : (
                <div className="text-sm space-y-1">
                  <p>Rating: {codeforcesData?.rating ?? "—"}</p>
                  <p>Max Rating: {codeforcesData?.maxRating ?? "—"}</p>
                  <p>Rank: {codeforcesData?.rank ?? "—"}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* leaderboard + rest of the page unchanged */}
      <div className="text-gray-800 italic text-center text-xl mb-6">
        Leaderboard unlocked! Are you #1? 🔥
      </div>

      <div className="grid grid-cols-3 gap-10">
        {/* LeetCode – Questions Solved */}
        <div>
          <h3 className="font-bold text-lg text-gray-700 mb-2 flex items-center">
            LeetCode&nbsp;–&nbsp;Questions&nbsp;Solved
            <button
              onClick={() => refreshLeaderboard("leetQ")}
              title="Refresh"
              className="ml-1"
            >
              <RefreshCw
                size={16}
                className={lbLoading.leetQ ? "animate-spin" : ""}
              />
            </button>
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {leetRankByQ.map((u, i) => (
              <div
                key={i}
                className="flex items-center bg-[#D9EFFF] rounded-full px-4 py-2 shadow-sm"
              >
                <span className="w-8 mr-3 text-center font-bold text-gray-600">
                  {symbolForRank(i)}
                </span>
                <img
                  src={u.image_url}
                  alt="avatar"
                  className="w-6 h-6 rounded-full mr-3"
                />
                <span className="text-gray-700">
                  {u.name} – {u.questions_solved}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* LeetCode – Contest Rating */}
        <div>
          <h3 className="font-bold text-lg text-gray-700 mb-2 flex items-center">
            LeetCode&nbsp;–&nbsp;Contest&nbsp;Rating
            <button
              onClick={() => refreshLeaderboard("leetR")}
              title="Refresh"
              className="ml-1"
            >
              <RefreshCw
                size={16}
                className={lbLoading.leetR ? "animate-spin" : ""}
              />
            </button>
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {leetRankByR.map((u, i) => (
              <div
                key={i}
                className="flex items-center bg-[#D9EFFF] rounded-full px-4 py-2 shadow-sm"
              >
                <span className="w-8 mr-3 text-center font-bold text-gray-600">
                  {symbolForRank(i)}
                </span>
                <img
                  src={u.image_url}
                  alt="avatar"
                  className="w-6 h-6 rounded-full mr-3"
                />
                <span className="text-gray-700">
                  {u.name} – {u.contest_rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Codeforces */}
        <div>
          <h3 className="font-bold text-lg text-gray-700 mb-2 flex items-center">
            Codeforces
            <button
              onClick={() => refreshLeaderboard("cf")}
              title="Refresh"
              className="ml-1"
            >
              <RefreshCw
                size={16}
                className={lbLoading.cf ? "animate-spin" : ""}
              />
            </button>
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {codeforcesRank.map((u, i) => (
              <div
                key={i}
                className="flex items-center bg-[#D9EFFF] rounded-full px-4 py-2 shadow-sm"
              >
                <span className="w-8 mr-3 text-center font-bold text-gray-600">
                  {symbolForRank(i)}
                </span>
                <img
                  src={u.image_url}
                  alt="avatar"
                  className="w-6 h-6 rounded-full mr-3"
                />
                <span className="text-gray-700">
                  {u.name} – {u.contest_rating}
                </span>
              </div>
      ))}
    </div>
  </div>
</div>
    </div>
  );
};

export default CodingProfiles;
