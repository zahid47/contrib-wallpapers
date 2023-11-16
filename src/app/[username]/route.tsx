import { fetchData } from "@/utils/fetchData";
import { pickColor } from "@/utils/pickColor";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import z from "zod";

export const runtime = "edge";

const themes = ["github_green", "github_halloween"] as const; //infer from THEMES instead

const searchParamsSchema = z.object({
  username: z.string(),
  mode: z.enum(["dark", "light"]).default("light").catch("light"),
  theme: z.enum(themes).default(themes[0]).catch(themes[0]),
  h: z.coerce.number().default(1080).catch(1080),
  w: z.coerce.number().default(1920).catch(1920),
});

export async function GET(request: NextRequest) {
  const options = searchParamsSchema.parse(
    Object.fromEntries(request.nextUrl.searchParams.entries())
  );

  const data = await fetchData(options.username);

  const flatContributions = data
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
                          flatContributions,
                          day.contributionCount,
                          options
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
