import { config } from "dotenv";

//TODO: make api find out how many org im in and account for that
//TODO: get profile image from git, set that as main image

// Load API key
config();
const apiKey = process.env.GH_API_ACCESS_TOKEN;

// Query wrappers
async function graphqlQuery(query, variables = {}) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const data = await response.json();
  return data;
}

// Read Github data & write to JSON
export default async function compileAndWriteGHData() {
  // const { followers, diskUsage } = await getUserInfo();
  // const diskUsageMB = (diskUsage / 1000).toFixed(2);

  const totalContributions = await computeTotalContributions();
  console.log("total", totalContributions);
}

// Fetch total contribution count
async function computeTotalContributions() {
  const contributions = await fetchAllContributions();
  // const issues = await fetchAllIssues();
  // const prs = await fetchAllPullRequests();
  // const reviews = await fetchAllReviews();

  console.log(contributions);

  const extraContributions = 2; //Account creation, orgs joined

  return contributions;
}

async function fetchAllContributions() {
  let total = 0;
  const startYear = 2022;
  const currentYear = new Date().getFullYear();

  for (let year = startYear; year <= currentYear; year++) {
    console.log(year, await getYearlyContributions(year));
    total += await getYearlyContributions(year);
  }

  // total += 2; //Account creation, organizations joined

  return total;
}

async function getYearlyContributions(year) {
  const commitsQuery = `
    query($from: DateTime!, $to: DateTime!) {
      viewer {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalRepositoryContributions
        }
      }
    }
  `;

  const fromDate = `${year}-01-01T00:00:00Z`;
  const toDate = `${year + 1}-01-01T00:00:00Z`;

  try {
    const rawCommits = await graphqlQuery(commitsQuery, {
      from: fromDate,
      to: toDate,
    });

    const contributionsCollection =
      rawCommits.data.viewer.contributionsCollection;

    const totalContributions =
      contributionsCollection.totalCommitContributions +
      contributionsCollection.totalIssueContributions +
      contributionsCollection.totalPullRequestContributions +
      contributionsCollection.totalPullRequestReviewContributions +
      contributionsCollection.totalRepositoryContributions;

    return totalContributions;
  } catch (error) {
    console.error("Error fetching data:", error);
    return 0;
  }
}

// async function getUserInfo() {
//   return axios
//     .get("https://api.github.com/user", {
//       headers: { Authorization: `token ${apiKey}` },
//     })
//     .then((response) => {
//       return {
//         followers: response.data.followers,
//         diskUsage: response.data.disk_usage,
//       };
//     })
//     .catch((error) => {
//       console.error(
//         `Request failed with status code ${error.response ? error.response.status : "unknown"}`
//       );
//     });
// }
