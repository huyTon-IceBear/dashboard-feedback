// Linear SDK
import { LinearClient, LinearFetch, User } from '@linear/sdk';
import { TaskLinear } from 'src/types/task';

import { LINEAR_API_TEST } from 'src/config-global';

// Api key authentication
const client1 = new LinearClient({
  apiKey: LINEAR_API_TEST,
});

export async function GET() {
  const issues = await client1.issues();
  return Response.json({ issues });
}

export async function POST(request: Request) {
  const { TaskData } = await request.json();
  console.log('TaskData', TaskData);
  const teams = await client1.teams();
  try {
    if (teams.nodes[0].id) {
      await client1.createIssue({
        teamId: teams.nodes[0].id,
        title: TaskData.title,
        description: TaskData.description,
        priority: TaskData.priority,
      });
    }
  } catch (err) {
    console.error(`Internal server error: Something went wrong creating issue on Linear`);
  }
  return new Response('OK');
}
