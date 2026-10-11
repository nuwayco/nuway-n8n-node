import type { INodeProperties } from 'n8n-workflow';

export const conversationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['conversation'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get one conversation with its messages',
				action: 'Get a conversation',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List conversations',
				action: 'Get many conversations',
			},
			{
				name: 'Get Messages',
				value: 'getMessages',
				description: "List a conversation's messages",
				action: 'Get messages of a conversation',
			},
		],
		default: 'getAll',
	},
];

export const conversationFields: INodeProperties[] = [
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['conversation'], operation: ['get', 'getMessages'] } },
		description: 'The conversation\'s session_id (chat ID)',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['conversation'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 200 },
		default: 50,
		displayOptions: { show: { resource: ['conversation'], operation: ['getAll'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['conversation'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'options',
				default: 'text',
				options: [
					{ name: 'Phone', value: 'phone' },
					{ name: 'Text', value: 'text' },
					{ name: 'Web Voice', value: 'web' },
				],
			},
			{
				displayName: 'From',
				name: 'date_from',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'all',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Dissatisfied', value: 'dissatisfied' },
					{ name: 'Read', value: 'read' },
					{ name: 'Satisfied', value: 'satisfied' },
					{ name: 'Unread', value: 'unread' },
					{ name: 'Unresolved', value: 'unresolved' },
				],
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'options',
				default: 'AI_ANSWERED',
				options: [
					{ name: 'AI Answered', value: 'AI_ANSWERED' },
					{ name: 'AI Failed', value: 'AI_FAILED' },
					{ name: 'Disliked', value: 'DISLIKED' },
					{ name: 'Human Answered', value: 'HUMAN_ANSWERED' },
					{ name: 'Liked', value: 'LIKED' },
					{ name: 'Phone', value: 'PHONE' },
					{ name: 'Text', value: 'TEXT' },
					{ name: 'Voice', value: 'VOICE' },
				],
			},
			{
				displayName: 'To',
				name: 'date_to',
				type: 'dateTime',
				default: '',
			},
		],
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['conversation'], operation: ['getMessages'] } },
		options: [
			{
				displayName: 'Answer Type',
				name: 'answer_type',
				type: 'options',
				default: 'ANSWER',
				options: [
					{ name: 'Answered', value: 'ANSWER' },
					{ name: 'Error', value: 'ERROR' },
					{ name: 'Not Answered', value: 'NO_ANSWER' },
				],
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				default: 'user',
				options: [
					{ name: 'AI Worker', value: 'bot' },
					{ name: 'Customer', value: 'user' },
				],
			},
		],
	},
];
