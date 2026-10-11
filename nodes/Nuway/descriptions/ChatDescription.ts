import type { INodeProperties } from 'n8n-workflow';

export const chatOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['chat'] } },
		options: [
			{
				name: 'Send Message',
				value: 'send',
				description: "Send a customer's message to your AI workers and get the reply",
				action: 'Send a message',
			},
		],
		default: 'send',
	},
];

export const chatFields: INodeProperties[] = [
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['chat'], operation: ['send'] } },
		description: "The customer's message",
	},
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['chat'], operation: ['send'] } },
		description:
			'Continue a conversation: the session_id an earlier reply returned. Leave empty to start a new conversation.',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['chat'], operation: ['send'] } },
		options: [
			{
				displayName: 'AI Worker',
				name: 'agent',
				type: 'options',
				default: 'auto',
				description: 'Which AI worker answers. Automatic picks the right one for each message.',
				options: [
					{ name: 'Automatic', value: 'auto' },
					{ name: 'Sales', value: 'sales' },
					{ name: 'Scheduler', value: 'scheduler' },
					{ name: 'Support', value: 'support' },
				],
			},
			{
				displayName: 'Customer Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Stored on the conversation',
			},
			{
				displayName: 'Customer First Name',
				name: 'first_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Customer Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
			},
		],
	},
];
