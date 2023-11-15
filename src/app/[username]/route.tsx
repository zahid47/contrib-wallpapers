import { fetchData } from "@/utils/fetchData";
import { pickColor } from "@/utils/pickColor";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  const data = await fetchData(username!);

  const cleanContributions = data
    .map((w) => w.contributionDays.map((d) => d.contributionCount))
    .flat(1);

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
                      key={i}
                      style={{
                        height: 18,
                        width: 18,
                        backgroundColor: pickColor(
                          cleanContributions,
                          day.contributionCount
                        ),
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
