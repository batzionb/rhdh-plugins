/*
 * Copyright Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { parseEntityRef } from '@backstage/catalog-model';
import { DiscoveryApi } from '@backstage/plugin-permission-common/index';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { AuthService } from '@backstage/backend-plugin-api';

import axios, { AxiosRequestConfig, isAxiosError } from 'axios';

import {
  Configuration,
  DefaultApi,
} from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';

type RunWorkflowTemplateActionInput = { parameters: JsonObject };
type RunWorkflowTemplateActionOutput = { instanceUrl: string };

const getError = (err: unknown): Error => {
  if (
    isAxiosError<{ error: { message: string; name: string } }>(err) &&
    err.response?.data?.error?.message
  ) {
    const error = new Error(err.response?.data?.error?.message);
    error.name = err.response?.data?.error?.name || 'Error';
    return error;
  }
  return err as Error;
};

export const createRunWorkflowAction = (
  discoveryService: DiscoveryApi,
  authService: AuthService,
) => {
  return createTemplateAction<
    RunWorkflowTemplateActionInput,
    RunWorkflowTemplateActionOutput
  >({
    id: 'orchestrator:workflow:run',
    description: 'Run a SonataFlow workflow.',
    schema: {
      input: {
        required: ['parameters'],
        type: 'object',
        properties: {
          parameters: {
            type: 'object',
            title: 'Parameters',
            description: 'The parameters of the template',
          },
        },
      },
    },
    supportsDryRun: true,
    async handler(ctx) {
      const baseUrl = await discoveryService.getBaseUrl('orchestrator');
      const axiosInstance = axios.create({
        baseURL: baseUrl,
      });
      const config = new Configuration({});
      const api = new DefaultApi(config, baseUrl, axiosInstance);
      // const credentials = await ctx.getInitiatorCredentials() as BackstageCredentials & {token: string};
      const { token } = (await authService.getPluginRequestToken({
        onBehalfOf: await ctx.getInitiatorCredentials(),
        targetPluginId: 'orchestrator',
      })) ?? { token: ctx.secrets?.backstageToken };
      const reqConfigOption: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const entity = ctx.templateInfo?.entityRef;
      if (!entity) {
        throw new Error('No template entity');
      }
      try {
        const { data } = await api.executeWorkflow(
          parseEntityRef(entity).name,
          { inputData: ctx.input.parameters },
          undefined,
          reqConfigOption,
        );
        ctx.output('instanceUrl', `/orchestrator/instances/${data.id}`);
      } catch (err) {
        throw getError(err);
      }
    },
  });
};
