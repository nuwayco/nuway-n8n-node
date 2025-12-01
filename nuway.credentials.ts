import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NuwayApi implements ICredentialType {
  name = 'nuwayApi';
  displayName = 'NUWAY API';
  documentationUrl = 'https://nuway.co';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://app.nuway.co',
    }
  ];
}
