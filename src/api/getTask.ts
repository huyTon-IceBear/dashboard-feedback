import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
// types
import { IPostItem } from 'src/types/blog';

// Linear SDK
import { LinearClient, LinearFetch, User } from "@linear/sdk";
import { TaskLinear } from 'src/types/task';

import { LINEAR_API_TEST, LINEAR_API_OPUS } from 'src/config-global';

// Api key authentication
const client1 = new LinearClient({
  apiKey: LINEAR_API_TEST
})

// const client2 = new LinearClient({
//   apiKey: LINEAR_API_OPUS
// })


// ----------------------------------------------------------------------

export async function getIssues() {
  const issues = await client1.issues();
  console.log("issues", issues)
}
