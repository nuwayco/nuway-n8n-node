import type { INodeProperties } from 'n8n-workflow';

export const teamMemberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['teamMember'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List the team members meetings can be booked with',
				action: 'Get many team members',
			},
		],
		default: 'getAll',
	},
];

export const meetingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['meeting'] } },
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a meeting on its calendar and email the host and the attendee',
				action: 'Cancel a meeting',
			},
			{
				name: 'Get Availability',
				value: 'getAvailability',
				description: "Free start times on a team member's calendar for one day",
				action: 'Get availability',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List meetings',
				action: 'Get many meetings',
			},
		],
		default: 'getAll',
	},
];

export const meetingFields: INodeProperties[] = [
	// getAll
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['meeting'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				default: 'google_calendar',
				options: [
					{ name: 'Cal.com', value: 'calcom' },
					{ name: 'Calendly', value: 'calendly' },
					{ name: 'Google Calendar', value: 'google_calendar' },
					{ name: 'Microsoft Outlook', value: 'microsoft_graph' },
					{ name: 'On Site', value: 'on_site' },
				],
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'scheduled',
				options: [
					{ name: 'Cancelled', value: 'cancelled' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Confirmed', value: 'confirmed' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Rescheduled', value: 'rescheduled' },
					{ name: 'Scheduled', value: 'scheduled' },
				],
			},
			{
				displayName: 'Team Member Emails',
				name: 'team_member_email',
				type: 'string',
				default: '',
				description: 'Comma-separated team member emails',
			},
		],
	},

	// getAvailability
	{
		displayName: 'Team Member Email',
		name: 'hostEmail',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['meeting'], operation: ['getAvailability'] } },
		description: 'A team member\'s email, from Team Member → Get Many',
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['meeting'], operation: ['getAvailability'] } },
		description: 'The day to check, in the timezone below',
	},
	{
		displayName: 'Timezone',
		name: 'timezone',
		type: 'string',
		placeholder: 'America/New_York',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['meeting'], operation: ['getAvailability'] } },
		description: "The customer's IANA timezone",
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['meeting'], operation: ['getAvailability'] } },
		options: [
			{
				displayName: 'Duration (Minutes)',
				name: 'duration_minutes',
				type: 'number',
				typeOptions: { minValue: 5, maxValue: 480 },
				default: 30,
			},
			{
				displayName: 'Earliest Time',
				name: 'earliest_time',
				type: 'string',
				placeholder: '09:00',
				default: '',
				description: 'HH:MM in the timezone above',
			},
			{
				displayName: 'Latest Time',
				name: 'latest_time',
				type: 'string',
				placeholder: '17:00',
				default: '',
				description: 'HH:MM in the timezone above',
			},
		],
	},

	// cancel
	{
		displayName: 'Meeting ID',
		name: 'meetingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['meeting'], operation: ['cancel'] } },
	},
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['meeting'], operation: ['cancel'] } },
		description: 'Included in the cancellation emails',
	},
];
