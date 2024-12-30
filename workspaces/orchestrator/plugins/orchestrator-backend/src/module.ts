import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { createRunWorkflowAction } from './workflowAction';

export const scaffolderModuleCustomExtensions = createBackendModule({
  pluginId: 'scaffolder', // name of the plugin that the module is targeting
  moduleId: 'orchestrator-scaffolder-extensions',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,        
      },
      async init({ scaffolder }) {        
        scaffolder.addActions(createRunWorkflowAction()); 
      },
    });
  },
});