import { createTemplateAction, TemplateAction } from '@backstage/plugin-scaffolder-node';
import {JsonObject } from '@backstage/types';

export const createRunWorkflowAction = (): TemplateAction<{
    contents: string;
    filename: string;
}, JsonObject> => {
    return createTemplateAction<{ contents: string; filename: string }>({
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
      async handler(ctx) {
        console.log("\n\n\n", ctx.input.contents, "\n\n\n");
      },
    });
  };

