import axios from "axios";
import { config } from "dotenv";
import fs from "fs";

//TODO: get profile image from git, set that as main image file

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

async function restQuery(extensionPath, returnCallback) {
  return axios
    .get(`https://api.github.com/${extensionPath}`, {
      headers: { Authorization: `token ${apiKey}` },
    })
    .then(returnCallback)
    .catch((error) => {
      console.error(
        `Request failed with status code ${error.response ? error.response.status : "unknown"}`,
      );
    });
}

// Read Github data & write to JSON
export default async function compileAndWriteGHData() {
  const outputPath = "sitedata/ghdata.json";
  const jsonData = JSON.parse(fs.readFileSync(outputPath, "utf8"));

  const { username } = await getUserInfo();
  const today = new Date();

  const dateString = `${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate()}-${today.getFullYear()}`;
  const totalContributions = await computeTotalContributions();
  let totalLinesModified = 0;
  while (totalLinesModified < jsonData.linesModified) {
    totalLinesModified = await computeTotalLinesModified(username);
  }

  console.log(
    "Date string",
    dateString,
    "Total Contributions",
    totalContributions,
    "Total Modifications",
    totalLinesModified,
  );

  if (dateString && totalContributions && totalLinesModified) {
    jsonData.lastUpdated = dateString;
    jsonData.contributions = totalContributions;
    jsonData.linesModified = totalLinesModified;

    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    console.log(`json data updated at ${outputPath}`);
  } else {
    console.log("something is wrong with data");
  }
}

async function computeTotalContributions() {
  const startYear = 2022;
  const currentYear = new Date().getFullYear();

  let total = 0;
  for (let year = startYear; year <= currentYear; year++) {
    const yearlyContributions = await getYearlyContributions(year);

    total += yearlyContributions;
  }

  const missingCommits = 20; // api missing a constant amount of contributions
  return total + missingCommits;
}

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

  const rawCommits = await graphqlQuery(commitsQuery, {
    from: fromDate,
    to: toDate,
  });

  const totalContributions =
    rawCommits.data.viewer.contributionsCollection.contributionCalendar
      .totalContributions;

  return totalContributions;
}

async function computeTotalLinesModified(username) {
  const allRepos = await getAllRepos(username);
  let totalLinesModified = 0;

  for (const repo of allRepos) {
    const repoLinesModified = await getLinesModifiedInRepo(repo, username);
    totalLinesModified += repoLinesModified;
  }

  console.log(`Total lines modified: ${totalLinesModified}`);
  return totalLinesModified;
}

async function getLinesModifiedInRepo(repo, username) {
  const stats = await restQuery(
    `repos/${repo.full_name}/stats/contributors`,
    (response) => response.data,
  );
  let repoLinesModified = 0;
  if (Array.isArray(stats)) {
    for (const contributor of stats) {
      if (contributor.author && contributor.author.login === username) {
        for (const week of contributor.weeks) {
          repoLinesModified += week.a + week.d;
        }
        break;
      }
    }
  }
  return repoLinesModified;
}

async function getAllRepos() {
  let allRepos = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const repos = await restQuery(
      `user/repos?page=${page}&per_page=${perPage}`,
      (response) => response.data,
    );

    if (repos.length === 0) {
      break;
    }

    allRepos = allRepos.concat(repos);
    page++;
  }

  return allRepos;
}

async function getUserInfo() {
  const returnCallback = (response) => {
    return {
      username: response.data.login,
    };
  };

  const { username } = await restQuery("user", returnCallback);

  return { username };
}
