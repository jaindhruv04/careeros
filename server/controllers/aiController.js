import Groq from "groq-sdk";
import {
  getMyCompanies,
  getMyDsaProblems,
  createDsaProblem,
  deleteDsaProblem,
} from "./aiToolsController.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function chatWithAI(req, res) {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are CareerOS AI, a helpful career and placement-preparation assistant for students. Give practical, concise advice. You have access to the user's CareerOS data through tools. Never claim to know data unless you retrieved it using an available tool.",
      },
      {
        role: "user",
        content: message.trim(),
      },
    ];

    const tools = [
      {
        type: "function",
        function: {
          name: "get_my_companies",
          description:
            "Get the logged-in user's active company and job application records from CareerOS.",
          parameters: {
            type: "object",
            properties: {},
            required: [],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_my_dsa_problems",
          description:
            "Get the user's active DSA problems from CareerOS. Use this when the user asks about their tracked DSA problems, solved problems, difficulty, topics, priorities, revision status, or notes.",
          parameters: {
            type: "object",
            properties: {},
            required: [],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "create_dsa_problem",
          description:
            "Create a new DSA problem in the user's CareerOS tracker. Use this when the user asks to add or track a DSA problem.",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Name of the DSA problem",
              },
              topic: {
                type: "string",
                description:
                  "DSA topic, such as Array, HashMap, DP, Graph, or Tree",
              },
              difficulty: {
                type: "string",
                description:
                  "Problem difficulty, such as Easy, Medium, or Hard",
              },
              status: {
                type: "string",
                description:
                  "Problem status, such as Todo, In Progress, or Solved",
              },
              priority: {
                type: "string",
                description: "Problem priority, such as Low, Medium, or High",
              },
              revisionNeeded: {
                type: "boolean",
                description: "Whether the problem needs revision",
              },
              notes: {
                type: "string",
                description: "Optional notes about the problem",
              },
            },
            required: ["name", "topic", "difficulty", "status", "priority"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "delete_dsa_problem",
          description:
            "Delete a DSA problem from the user's CareerOS tracker. Use this when the user explicitly asks to delete or remove a DSA problem.",
          parameters: {
            type: "object",
            properties: {
              problemId: {
                type: "integer",
                description: "ID of the DSA problem to delete",
              },
            },
            required: ["problemId"],
          },
        },
      },
    ];

    let completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      messages,
      tools,
      tool_choice: "auto",
      temperature: 0.4,
      max_tokens: 600,
    });

    let assistantMessage = completion.choices?.[0]?.message;

    if (!assistantMessage) {
      return res.status(502).json({
        error: "AI returned an empty response",
      });
    }

    let toolRounds = 0;
    const maxToolRounds = 5;

    while (assistantMessage.tool_calls?.length && toolRounds < maxToolRounds) {
      toolRounds++;

      messages.push(assistantMessage);

      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.function.name === "get_my_companies") {
          const companies = await getMyCompanies(req.userId);

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(companies),
          });
        }

        if (toolCall.function.name === "get_my_dsa_problems") {
          const problems = await getMyDsaProblems(req.userId);

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(problems),
          });
        }

        if (toolCall.function.name === "create_dsa_problem") {
          const data = JSON.parse(toolCall.function.arguments);

          const problem = await createDsaProblem(req.userId, data);

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(problem),
          });
        }

        if (toolCall.function.name === "delete_dsa_problem") {
          const data = JSON.parse(toolCall.function.arguments);

          const result = await deleteDsaProblem(req.userId, data.problemId);

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          });
        }
      }

      completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        messages,
        tools,
        tool_choice: "auto",
        temperature: 0.4,
        max_tokens: 600,
      });

      assistantMessage = completion.choices?.[0]?.message;

      if (!assistantMessage) {
        return res.status(502).json({
          error: "AI returned an empty response",
        });
      }
    }

    if (toolRounds >= maxToolRounds && assistantMessage.tool_calls?.length) {
      return res.status(502).json({
        error: "AI used too many tool calls",
      });
    }

    const reply = assistantMessage?.content?.trim();

    if (!reply) {
      return res.status(502).json({
        error: "AI returned an empty response",
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Groq API error:", error);
    return res.status(500).json({
      error: "Unable to get an AI response",
    });
  }
}

export { chatWithAI };
