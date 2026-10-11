import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NuwayApi implements ICredentialType {
	name = 'nuwayApi';

	displayName = 'NUWAY API';

	icon = 'file:nuway.png' as const;

	documentationUrl = 'https://github.com/nuwayco/nuway-n8n-node';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your company API key from the NUWAY dashboard (Settings → API). It starts with nwk_.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://ai.nuway.co',
			description: 'The NUWAY API address. Leave as is unless NUWAY gave you another one.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey.trim()}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/external/team-members',
			method: 'GET',
		},
	};
}
