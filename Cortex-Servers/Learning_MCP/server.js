import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { google } from 'googleapis';
import { StdioServerTransport } from '../typescript-sdk-main/src/server/stdio.ts';
require('dotenv').config();

// Create an MCP server
const server = new McpServer({
    name: 'submit-calender',
    version: '1.0.0'
});

// Mock function to simulate fetching calendar data by date

const getMyCalenderDatabyDate = async (date) => {
    // Simulate fetching calendar data for the given date

    const apikey = process.env.Google_Calendar_ApiKey;
    if (!apikey) {
        throw new Error('Google Calendar API key is not set in environment variables');
    }

    const calender = google.calendar(
        {
            version: 'v3',
            auth: apikey
        }
    );

    try {
            const result = await calender.events.list({
            calendarId: 'primary',
            timeMin: new Date(date).toISOString(),
            timeMax: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString(),
            singleEvents: true,
            maxResults: 10,
            orderBy: 'startTime'
        });

        // if (result.data.items) {
        //     return {
        //         date: date,
        //         events: result.data.items.map(event => ({
        //             time: event.start?.dateTime || event.start?.date || 'All day',
        //             event: event.summary || 'No title'
        //         }))
        //     };
        // }

        const events = result.data.items || [];
        const meetings = events.map((event)=> {
            const start = event.start?.dateTime || event.start?.date || 'All day';
            const summary = event.summary || 'No title';
            return { start, event: summary };
        })

        if(meetings.length > 0) {
            return {
                meetings,
                status: "success",
                meessage: "Meetings fetched successfully"
            };
        }
        else {
            return {
                meetings: [],
                status: "failed",
                message: 'No meetings found for this date'
            };
        }
    }
    catch (error) {
        return { 
            meetings: [],
            status: "error",
            message: `Error fetching meetings: ${error}`
        };
    }
}

// Add an addition tool
server.tool(
    'getMyCalenderDatabyDate',
    {
        date: z.string().refine((val) => !isNaN(Date.parse(val)), 
        { message: 'Invalid date format' }    
        ) // Expecting a date string
    },
    async ({ date }) => {
        return {
            content: [
                { 
                    type: 'text',
                    text: JSON.stringify(await getMyCalenderDatabyDate(date), null, 2)
                }
            ],
            toolCallSuccess: true
        };
    }
);

// set transfort and start the server
const init = async () => {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

// calling the init function to start the server
init();


// Add a dynamic greeting resource
// server.registerResource(
//     'greeting',
//     new ResourceTemplate('greeting://{name}', { list: undefined }),
//     {
//         title: 'Greeting Resource', // Display name for UI
//         description: 'Dynamic greeting generator'
//     },
//     async (uri, { name }) => ({
//         contents: [
//             {
//                 uri: uri.href,
//                 text: `Hello, ${name}!`
//             }
//         ]
//     })
// );

// // Set up Express and HTTP transport
// const app = express();
// app.use(express.json());

// app.post('/mcp', async (req, res) => {
//     // Create a new transport for each request to prevent request ID collisions
//     const transport = new StreamableHTTPServerTransport({
//         sessionIdGenerator: undefined,
//         enableJsonResponse: true
//     });

//     res.on('close', () => {
//         transport.close();
//     });

//     await server.connect(transport);
//     await transport.handleRequest(req, res, req.body);
// });

// const port = parseInt(process.env.PORT || '3000');
// app.listen(port, () => {
//     console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
// }).on('error', error => {
//     console.error('Server error:', error);
//     process.exit(1);
// });