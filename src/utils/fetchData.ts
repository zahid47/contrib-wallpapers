type GitHubResponse = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: Week[];
        };
      };
    };
  };
};

type Week = {
  contributionDays: ContributionDay[];
};

type ContributionDay = {
  contributionCount: number;
  date: string;
};


export const fetchData = async (username: string) => {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: `
          {
            viewer {
              login
            }
            user(login: "${username}") {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
    }),
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      "content-type": "application/json",
    },
  });

  const data: GitHubResponse = await res.json();

  return data.data.user.contributionsCollection.contributionCalendar.weeks;
};