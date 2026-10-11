import type { INodeProperties } from 'n8n-workflow';

export const knowledgeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['knowledge'] } },
		options: [
			{
				name: 'Add FAQ',
				value: 'addFaq',
				description: 'Add a question and answer; it is trained automatically',
				action: 'Add an FAQ',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: "Delete a training resource and remove it from the AI's knowledge",
				action: 'Delete a resource',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List training resources',
				action: 'Get many resources',
			},
			{
				name: 'Update FAQ',
				value: 'updateFaq',
				description: "Replace an FAQ's question and answer; it is retrained automatically",
				action: 'Update an FAQ',
			},
			{
				name: 'Upload Document',
				value: 'uploadDocument',
				description: 'Upload a training document; it is trained automatically',
				action: 'Upload a document',
			},
		],
		default: 'getAll',
	},
];

export const knowledgeFields: INodeProperties[] = [
	// getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['knowledge'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 200 },
		default: 50,
		displayOptions: { show: { resource: ['knowledge'], operation: ['getAll'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['knowledge'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'FAQ',
				options: [
					{ name: 'Audio', value: 'AUDIO' },
					{ name: 'Excel', value: 'EXCEL' },
					{ name: 'FAQ', value: 'FAQ' },
					{ name: 'File', value: 'FILE' },
					{ name: 'Picture', value: 'PICTURE' },
					{ name: 'Website', value: 'WEB' },
				],
			},
		],
	},

	// uploadDocument
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: { show: { resource: ['knowledge'], operation: ['uploadDocument'] } },
		description: 'The input field holding the file: pdf, docx, txt, csv, xlsx, an image or audio',
	},

	// addFaq / updateFaq / delete
	{
		displayName: 'Resource ID',
		name: 'resourceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['knowledge'], operation: ['updateFaq', 'delete'] } },
		description: 'The id from Knowledge → Get Many',
	},
	{
		displayName: 'Question',
		name: 'question',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['knowledge'], operation: ['addFaq', 'updateFaq'] } },
	},
	{
		displayName: 'Answer',
		name: 'answer',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['knowledge'], operation: ['addFaq', 'updateFaq'] } },
	},
];
