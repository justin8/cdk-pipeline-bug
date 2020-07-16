#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkPipelineBugStack } from '../lib/cdk-pipeline-bug-stack';

const app = new cdk.App();
new CdkPipelineBugStack(app, 'CdkPipelineBugStack');
