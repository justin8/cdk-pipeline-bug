#!/usr/bin/env node
import "source-map-support/register";
import { CdkPipelineBugStack } from "../lib/cdk-pipeline-bug-stack";
import { Stage, Construct, StackProps, Stack, App } from "@aws-cdk/core";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import * as codecommit from "@aws-cdk/aws-codecommit";
import * as codebuild from "@aws-cdk/aws-codebuild";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";

class CdkBugApp extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stack = new CdkPipelineBugStack(this, "Stack", {});
  }
}

class MyPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();
    const repository = new codecommit.Repository(this, "repo", {
      repositoryName: "cdk-pipeline-bug",
    });

    const pipeline = new CdkPipeline(this, "Pipeline", {
      pipelineName: "CDKPipelineBug",
      cloudAssemblyArtifact,
      sourceAction: new codepipeline_actions.CodeCommitSourceAction({
        actionName: "CodeCommit",
        output: sourceArtifact,
        repository,
      }),
      synthAction: SimpleSynthAction.standardYarnSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        // environment: { buildImage: codebuild.LinuxBuildImage.STANDARD_4_0 },
      }),
    });

    pipeline.addApplicationStage(new CdkBugApp(this, "Prod", {}));
  }
}

const app = new App();
new MyPipelineStack(app, "Cdk-Bug-Pipeline", {});
