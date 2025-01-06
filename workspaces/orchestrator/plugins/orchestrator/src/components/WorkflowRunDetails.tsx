/*
 * Copyright 2024 The Backstage Authors
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
import React from 'react';

import { Link } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { AboutField } from '@backstage/plugin-catalog';

import { Grid, makeStyles, Typography } from '@material-ui/core';

import {
  capitalize,
  ProcessInstanceDTO,
  ProcessInstanceStatusDTO,
} from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';

import { VALUE_UNAVAILABLE } from '../constants';
import { workflowInstanceRouteRef, workflowRouteRef } from '../routes';
import { WorkflowInstanceStatusIndicator } from './WorkflowInstanceStatusIndicator';
import { WorkflowRunDetail } from './WorkflowRunDetail';

type WorkflowDetailsCardProps = {
  assessedBy?: ProcessInstanceDTO;
  details: WorkflowRunDetail;
};

const useStyles = makeStyles({
  root: {
    overflowY: 'auto',
  },
});

export const WorkflowRunDetails: React.FC<WorkflowDetailsCardProps> = ({
  assessedBy,
  details,
}) => {
  const styles = useStyles();
  const workflowInstanceLink = useRouteRef(workflowInstanceRouteRef);

  const workflowPageLink = useRouteRef(workflowRouteRef);

  return (
    <Grid container className={styles.root} alignContent="flex-start">
      <Grid item md={7} key="Workflow">
        <AboutField label="Workflow">
          <Link to={workflowPageLink({ workflowId: details.workflowId })}>
            <Typography variant="subtitle2" component="div">
              <b>{capitalize(details.processName)}</b>
            </Typography>
          </Link>
        </AboutField>
      </Grid>
      <Grid item md={5} key="Status">
        <AboutField label="Status">
          <Typography variant="subtitle2" component="div">
            <b>
              <WorkflowInstanceStatusIndicator
                status={details.state as ProcessInstanceStatusDTO}
              />
            </b>
          </Typography>
        </AboutField>
      </Grid>
      <Grid item md={7} key="Category">
        <AboutField label="Category">
          <Typography variant="subtitle2" component="div">
            <b>{capitalize(details.category ?? VALUE_UNAVAILABLE)}</b>
          </Typography>
        </AboutField>
      </Grid>
      <Grid item md={5} key="Duration">
        <AboutField label="Duration">
          <Typography variant="subtitle2" component="div">
            <b>{details.duration}</b>
          </Typography>
        </AboutField>
      </Grid>
      <Grid item md={7} key="Description">
        <AboutField label="Description">
          <Typography variant="subtitle2" component="div">
            <b>{details.description ?? VALUE_UNAVAILABLE}</b>
          </Typography>
        </AboutField>
      </Grid>
      <Grid item md={5} key="Started">
        <AboutField label="Started">
          <Typography variant="subtitle2" component="div">
            <b>{details.start}</b>
          </Typography>
        </AboutField>
      </Grid>
      {assessedBy ? (
        <Grid item md={12} key="Assessed by">
          <AboutField label="Assessed by">
            <Typography variant="subtitle2" component="div">
              <b>
                <Link
                  to={workflowInstanceLink({
                    instanceId: assessedBy.id,
                  })}
                >
                  {assessedBy.processName}
                </Link>
              </b>
            </Typography>
          </AboutField>
        </Grid>
      ) : null}
    </Grid>
  );
};
WorkflowRunDetails.displayName = 'WorkflowDetails';
