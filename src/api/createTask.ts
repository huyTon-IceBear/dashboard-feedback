import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
// types
import { IPostItem } from 'src/types/blog';

// Linear SDK
import { LinearClient, LinearFetch, User } from "@linear/sdk";
import { TaskLinear } from 'src/types/task';

import { LINEAR_API_TEST } from 'src/config-global';

// Api key authentication
const client1 = new LinearClient({
  apiKey: LINEAR_API_TEST
})

// ----------------------------------------------------------------------

export async function createIssue(TaskData: TaskLinear) {
  const me = await client1.viewer;
  const teams = await client1.teams();
  console.log(TaskData)
  if (teams.nodes[0].id) {
    await client1.createIssue(
      {
        teamId: teams.nodes[0].id,
        title: TaskData.title,
        description: TaskData.description,
        priority: TaskData.priority,
      }
    );
  }
}
