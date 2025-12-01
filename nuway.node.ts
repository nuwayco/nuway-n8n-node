import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NuwayAI implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'NUWAY Chatbot',
    name: 'nuwayChat',
    icon: 'file:nuway.svg',
    group: ['transform'],
    version: 1,
    description: 'Send messages to NUWAY AI chatbot',
    defaults: {
      name: 'NUWAY Chatbot',
    },
    inputs: ['main'],
    outputs: ['main'],

    credentials: [
      {
        name: 'nuwayApi',
        required: true
      }
    ],

    properties: [
      {
        displayName: 'User Message',
        name: 'message',
        type: 'string',
        default: '',
        required: true,
      }
    ]
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

    const credentials = await this.getCredentials('nuwayApi');
    const message = this.getNodeParameter('message', 0) as string;

    const response = await this.helpers.request({
      method: 'POST',
      url: `${credentials.baseUrl}/api/v1/conversation`,
      headers: {
        'X-API-KEY': ` ${credentials.apiKey}`
      },
      body: {
        message
      },
      json: true
    });

    return [
      [
        {
          json: response
        }
      ]
    ];
  }
}
