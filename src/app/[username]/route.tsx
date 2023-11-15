import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export const getData = async (username: string) => {
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

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  const data = await getData(username!);
  console.log("🚀", data);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          {data.map((w, week) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
                key={w.contributionDays[0].date}
              >
                {w.contributionDays.map((day, i) => {
                  return (
                    <div
                      style={{
                        height: 18,
                        width: 18,
                        borderRadius: 4,
                        margin: 2,
                        border: "2px solid rgba(0, 0, 0, 0.05)",
                      }}
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
    }
  );
}
