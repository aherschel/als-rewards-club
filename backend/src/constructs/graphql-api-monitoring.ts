import { AmplifyGraphqlApi } from '@aws-amplify/graphql-api-construct';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { MonitoringFacade } from 'cdk-monitoring-constructs';

export type AdditionalResources = {
  functions?: IFunction[];
};

export type GraphqlApiMonitoringProps = {
  api?: AmplifyGraphqlApi;
  additionalResources?: AdditionalResources;
};

export class GraphqlApiMonitoring extends Construct {
  private monitoring: MonitoringFacade;

  constructor(scope: Construct, id: string, props: GraphqlApiMonitoringProps) {
    super(scope, id);

    this.monitoring = new MonitoringFacade(scope, 'MonitoringFacade');

    this.monitoring.addMediumHeader('Amplify Backend');
    if (props.api) this.setupApiMonitoring(props.api);
    if (props.additionalResources) this.setupAdditionalResourceMonitoring(props.additionalResources);
  }

  setupApiMonitoring({ resources: { graphqlApi, tables, functions, cfnResources: { cfnGraphqlApi: { name } } } }: AmplifyGraphqlApi) {
    this.monitoring.addMediumHeader('Data Construct');
    this.monitoring.monitorAppSyncApi({
      api: graphqlApi,
      humanReadableName: name,
      alarmFriendlyName: name,
    });
    Object.values(tables).forEach((table) => this.monitoring.monitorDynamoTable({
      table,
      humanReadableName: table.tableName,
      alarmFriendlyName: table.tableName,
    }));
    Object.values(functions).forEach((lambdaFunction) => this.monitoring.monitorLambdaFunction({
      lambdaFunction,
      humanReadableName: lambdaFunction.functionName,
      alarmFriendlyName: lambdaFunction.functionName,
    }));
  }

  setupAdditionalResourceMonitoring(additionalResources: AdditionalResources) {
    const { functions } = additionalResources;

    this.monitoring.addMediumHeader('Additional Resources');
    (functions ?? []).forEach((lambdaFunction) => this.monitoring.monitorLambdaFunction({
      lambdaFunction,
      humanReadableName: lambdaFunction.functionName,
      alarmFriendlyName: lambdaFunction.functionName,
    }));
  }
}
