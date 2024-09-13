import { config } from "dotenv";

//TODO: make api find out how many org im in and account for that
//TODO: get profile image from git, set that as main image

// Load API key
config();
const apiKey = process.env.GH_API_ACCESS_TOKEN;

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

async function computeTotalContributions() {
  const contributions = await fetchAllContributions();
  const issues = await fetchAllIssues();
  const prs = await fetchAllPullRequests();
  const reviews = await fetchAllReviews();

  const extraContributions = 2; //Account creation, orgs joined

  return (
    contributions + len(issues) + len(prs) + len(reviews) + extraContributions
  );
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

// Fetch yearly contribtuions
async function getYearlyContributions(year) {
  const commitsQuery = `
    query($from: DateTime!, $to: DateTime!) {
      viewer {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
          }
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

    const totalCommits =
      rawCommits.data.viewer.contributionsCollection.contributionCalendar
        .totalContributions;

    return totalCommits;
  } catch (error) {
    console.error("Error fetching data:", error);
    return 0;
  }
}

// Fetch paginated information
async function fetchAllIssues() {
  const issuesQuery = `
  query($afterCursor: String) {
  viewer {
    issues(first: 100, after: $afterCursor, orderBy: { field: CREATED_AT, direction: DESC }) {
      edges {
        node {
          createdAt
          title
          body
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  }
`;

  let issues = [];
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const result = await graphqlQuery(issuesQuery, { afterCursor: endCursor });
    issues = issues.concat(result.viewer.issues.edges.map((edge) => edge.node));
    hasNextPage = result.viewer.issues.pageInfo.hasNextPage;
    endCursor = result.viewer.issues.pageInfo.endCursor;
  }

  return issues;
}

async function fetchAllPullRequests() {
  const prsQuery = `
  query($afterCursor: String) {
  viewer {
    pullRequests(first: 100, after: $afterCursor, orderBy: { field: CREATED_AT, direction: DESC }) {
      edges {
        node {
          createdAt
          title
          body
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  }
  `;

  let prs = [];
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const result = await graphqlQuery(prsQuery, { afterCursor: endCursor });
    prs = prs.concat(result.viewer.pullRequests.edges.map((edge) => edge.node));
    hasNextPage = result.viewer.pullRequests.pageInfo.hasNextPage;
    endCursor = result.viewer.pullRequests.pageInfo.endCursor;
  }

  return prs;
}

async function fetchAllReviews() {
  const reviewsQuery = `
  query($afterCursor: String) {
  viewer {
    pullRequests(first: 100, after: $afterCursor, orderBy: { field: CREATED_AT, direction: DESC }) {
      edges {
        node {
          reviews(first: 100) {
            edges {
              node {
                createdAt
                body
                author {
                  login
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  }
  `;

  let reviews = [];
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const result = await graphqlQuery(reviewsQuery, { afterCursor: endCursor });
    const prs = result.viewer.pullRequests.edges;

    for (const pr of prs) {
      reviews = reviews.concat(pr.node.reviews.edges.map((edge) => edge.node));
    }

    hasNextPage = result.viewer.pullRequests.pageInfo.hasNextPage;
    endCursor = result.viewer.pullRequests.pageInfo.endCursor;
  }

  return reviews;
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
