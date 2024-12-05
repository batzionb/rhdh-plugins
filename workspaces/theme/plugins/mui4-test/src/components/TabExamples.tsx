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
import Tabs, { TabsProps } from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export const TabExamples = () => {
  const colors: TabsProps['indicatorColor'][] = [
    undefined,
    'primary',
    'secondary',
  ];

  const [selectedTab, setSelectedTab] = React.useState(0);
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      {colors.map(color => (
        <div key={color} style={{ padding: '20px 0' }}>
          <Tabs
            value={selectedTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab label="One" />
            <Tab label="Two" />
            <Tab label="Three" />
            <Tab label="Disabled" disabled />
          </Tabs>
        </div>
      ))}
    </div>
  );
};
