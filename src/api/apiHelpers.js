import axios from "axios";
import { config } from "dotenv";

// Load API key
config();
const apiKey = process.env.GH_API_ACCESS_TOKEN;

// Call/Compile data
export default async function compileAndWriteGHData() {
  // const { followers, diskUsage } = await getUserInfo();
  // const diskUsageMB = (diskUsage / 1000).toFixed(2);

  const totalContributions = await getTotalContributions();
  console.log("total", totalContributions);
}

async function graphqlQuery(query) {
  try {
    const response = await axios.post(
      `https://api.github.com/graphql`,
      { query },
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error(
      `Request failed with status code ${error.response ? error.response.status : "unknown"}`,
    );
    throw error;
  }
}

async function getTotalContributions() {
  const contributionYears = await getContributionYears();

  const yearlyContrib = await getYearlyContributions(contributionYears[0]);
  console.log(yearlyContrib);

  return totalContributions;
}

async function getContributionYears() {
  const query = `
  query {
    viewer {
      contributionsCollection {
        contributionYears
      }
    }
  }
`;
  const rawData = await graphqlQuery(query);
  const { contributionYears } = rawData.viewer.contributionsCollection;

  return contributionYears;
}

async function getYearlyContributions(year) {
  const query = `
    query {
      viewer {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  const rawData = await graphqlQuery(query);
  console.log(rawData);

  const { contributionCalendar } = rawData.viewer.contributionsCollection;

  return contributionCalendar;
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

// async function getLinesModified() {
//   const getPropOverAllRepos = (repos) => {
//     let linesModified = 0;

//     for (const repo of repos) {
//       console.log(`${repo}`);
//     }
//   };

//   return axios
//     .get("https://api.github.com/user/repos", {
//       headers: { Authorization: `token ${apiKey}` },
//     })
//     .then((response) => {
//       // Get total commits
//       getPropOverAllRepos(response.data);
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
