import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { toolDefinitions, runTool } from "@/lib/tools";
import type { BillState } from "@/lib/mockBill";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

type AnthropicMessage = {
  role: "user" | "assistant";
  content: unknown;
};

async function callClaude(messages: AnthropicMessage[]) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY təyin olunmayıb (.env.local yoxlayın)");
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: toolDefinitions,
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Claude API error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage: string = body.message;
    const history: AnthropicMessage[] = Array.isArray(body.history) ? body.history : [];
    let bill: BillState = body.bill;

    const messages: AnthropicMessage[] = [
      ...history,
      { role: "user", content: userMessage },
    ];

    let turns = 0;
    let finalText = "";

    while (turns < 5) {
      turns++;
      const response = await callClaude(messages);
      const content = response.content as Array<Record<string, unknown>>;

      messages.push({ role: "assistant", content });

      if (response.stop_reason !== "tool_use") {
        finalText = content
          .filter((b) => b.type === "text")
          .map((b) => b.text as string)
          .join("\n");
        break;
      }

      const toolResults: Array<Record<string, unknown>> = [];
      for (const block of content) {
        if (block.type === "tool_use") {
          const { result, nextBill } = runTool(
            block.name as string,
            (block.input as Record<string, unknown>) ?? {},
            bill
          );
          bill = nextBill;
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        }
      }

      messages.push({ role: "user", content: toolResults });
    }

    return NextResponse.json({
      reply: finalText || "Üzr istəyirəm, cavab hazırlaya bilmədim.",
      history: messages,
      bill,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Naməlum xəta" },
      { status: 500 }
    );
  }
}
