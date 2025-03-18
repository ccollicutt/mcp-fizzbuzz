# FizzBuzz MCP Server

This is a simple NodeJS JavaScript MCP server that implements FizzBuzz.

What's FizzBuzz?

FizzBuzz is a simple programming task that asks you to print numbers from 1 to `n`, but for multiples of 3, print "Fizz" instead of the number, for multiples of 5, print "Buzz", and for multiples of both 3 and 5, print "FizzBuzz".

## Usage

### Cursor

Go to "Preferences -> Cursor Settings -> MCP".

Add a new MCP server that runs the `node mcp-fizzbuzz-server.js` command.

Ensure that it starts up.

In `Agent` mode, ask the agent to fizzbuzz a number, it should find the tool and ask to use it.

If you allow the agent to use the tool, it should return the correct result.