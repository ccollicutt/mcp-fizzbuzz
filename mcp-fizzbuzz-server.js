#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Log to console for debugging
console.error("STARTING FIZZBUZZ MCP SERVER");

// Create server
const server = new Server(
  { name: "fizzbuzz", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define the tools with the required inputSchema property
const TOOLS = [
  {
    name: "fizzbuzz",
    description: "Responds with fizzbuzz",
    inputSchema: {
      type: "object",
      properties: {
        n: {
          type: "number",
          description: "The number to fizzbuzz up to"
        }
      },
      required: ["n"]
    }
  }
];

// Handle all requests
server.fallbackRequestHandler = async (request) => {
  try {
    const { method, params, id } = request;
    console.error(`REQUEST: ${method} [${id}]`);
    
    // Initialize
    if (method === "initialize") {
      return {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "fizzbuzz", version: "1.0.0" }
      };
    }
    
    // Tools list
    if (method === "tools/list") {
      console.error(`TOOLS: ${JSON.stringify(TOOLS)}`);
      return { tools: TOOLS };
    }
    
    // Tool call
    if (method === "tools/call") {
      const { name, arguments: args = {} } = params || {};
      
      if (name === "fizzbuzz") {
        function fizzBuzz(n) {
            let response = "";
            for (var i=1; i <= n; i++) {
                if (i % 15 == 0)
                    response += "FizzBuzz";
                else if (i % 3 == 0)
                    response += "Fizz";
                else if (i % 5 == 0)
                    response += "Buzz";
                else
                    response += i;
                
                if (i < n) {
                    response += "\n";
                }
            }
            return response;
        }
        
        const n = args.n;
        console.error(`Running fizzbuzz with n=${n}`);
        const response = fizzBuzz(n);
        console.error(`Response: ${response}`);
        return {
          content: [
            { 
              type: "text", 
              text: response
            }
          ]
        };
      }
      
      return {
        error: {
          code: -32601,
          message: `Tool not found: ${name}`
        }
      };
    }
    
    // Required empty responses
    if (method === "resources/list") return { resources: [] };
    if (method === "prompts/list") return { prompts: [] };
    
    // Empty response for unhandled methods
    return {};
    
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    return {
      error: {
        code: -32603,
        message: "Internal error",
        data: { details: error.message }
      }
    };
  }
};

// Connect to stdio transport
const transport = new StdioServerTransport();

// Stay alive on SIGTERM
process.on("SIGTERM", () => {
  console.error("SIGTERM received but staying alive");
});

// Connect server
server.connect(transport)
  .then(() => console.error("Server connected"))
  .catch(error => {
    console.error(`Connection error: ${error.message}`);
    process.exit(1);
  });