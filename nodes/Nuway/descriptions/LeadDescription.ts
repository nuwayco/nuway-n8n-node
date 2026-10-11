import type { INodeProperties } from 'n8n-workflow';

export const leadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['lead'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get one scored lead',
				action: 'Get a lead',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List scored leads',
				action: 'Get many leads',
			},
		],
		default: 'getAll',
	},
];

export const leadFields: INodeProperties[] = [
	{
		displayName: 'Lead ID',
		name: 'leadId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['lead'], operation: ['get'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['lead'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 200 },
		default: 50,
		displayOptions: { show: { resource: ['lead'], operation: ['getAll'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['lead'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Highlighted Only',
				name: 'highlighted_only',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Needs Attention',
				name: 'needs_attention',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Rank',
				name: 'rank',
				type: 'options',
				default: 'hot',
				options: [
					{ name: 'Buy', value: 'buy' },
					{ name: 'Cold', value: 'cold' },
					{ name: 'Hot', value: 'hot' },
					{ name: 'Interested', value: 'interested' },
					{ name: 'Unsubscribed', value: 'unsubscribed' },
				],
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Name, email or company',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				default: 'recent',
				options: [
					{ name: 'Intent', value: 'intent' },
					{ name: 'Priority', value: 'priority' },
					{ name: 'Recent', value: 'recent' },
				],
			},
		],
	},
];
