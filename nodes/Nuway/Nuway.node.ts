import FormData from 'form-data';
import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import { chatFields, chatOperations } from './descriptions/ChatDescription';
import { conversationFields, conversationOperations } from './descriptions/ConversationDescription';
import { knowledgeFields, knowledgeOperations } from './descriptions/KnowledgeDescription';
import { leadFields, leadOperations } from './descriptions/LeadDescription';
import { meetingFields, meetingOperations, teamMemberOperations } from './descriptions/MeetingDescription';
import { nuwayApiRequest, nuwayApiRequestAllItems, toDay } from './GenericFunctions';

// NodeConnectionTypes.Main, without loading n8n-workflow at runtime (see GenericFunctions).
const MAIN = 'main' as NodeConnectionType;

export class Nuway implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NUWAY',
		name: 'nuway',
		icon: 'file:nuway.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Chat with your NUWAY AI workers and read or update their data',
		defaults: {
			name: 'NUWAY',
		},
		inputs: [MAIN],
		outputs: [MAIN],
		usableAsTool: true,
		credentials: [
			{
				name: 'nuwayApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Chat', value: 'chat' },
					{ name: 'Conversation', value: 'conversation' },
					{ name: 'Knowledge', value: 'knowledge' },
					{ name: 'Lead', value: 'lead' },
					{ name: 'Meeting', value: 'meeting' },
					{ name: 'Team Member', value: 'teamMember' },
				],
				default: 'chat',
			},
			...chatOperations,
			...chatFields,
			...conversationOperations,
			...conversationFields,
			...leadOperations,
			...leadFields,
			...teamMemberOperations,
			...meetingOperations,
			...meetingFields,
			...knowledgeOperations,
			...knowledgeFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const result = await runOperation.call(this, resource, operation, i);
				const records = Array.isArray(result) ? result : [result];
				returnData.push(
					...this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(records), {
						itemData: { item: i },
					}),
				);
			} catch (error) {
				if (this.continueOnFail()) {
					const { message, description } = error as { message: string; description?: string };
					const json: IDataObject = { error: message };
					if (description) json.description = description;
					returnData.push({ json, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

async function runOperation(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (resource === 'chat' && operation === 'send') {
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		const body: IDataObject = {
			message: this.getNodeParameter('message', i) as string,
		};
		const sessionId = (this.getNodeParameter('sessionId', i, '') as string).trim();
		if (sessionId) body.session_id = sessionId;
		// Automatic is the API's default; leaving it out keeps older servers happy too.
		if (options.agent && options.agent !== 'auto') body.agent = options.agent;
		const customer: IDataObject = {};
		for (const key of ['email', 'first_name', 'last_name']) {
			if (options[key]) customer[key] = options[key];
		}
		if (Object.keys(customer).length) body.customer = customer;
		return nuwayApiRequest.call(this, 'POST', '/chat', body);
	}

	if (resource === 'conversation') {
		if (operation === 'getAll') {
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
			return listOrAll.call(this, i, '/conversations', 'conversations', filters, 'offset');
		}
		const sessionId = encodeURIComponent(this.getNodeParameter('sessionId', i) as string);
		if (operation === 'get') {
			return nuwayApiRequest.call(this, 'GET', `/conversations/${sessionId}`);
		}
		if (operation === 'getMessages') {
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
			const response = await nuwayApiRequest.call(
				this, 'GET', `/conversations/${sessionId}/messages`, undefined, filters,
			);
			return (response.messages as IDataObject[]) || [];
		}
	}

	if (resource === 'lead') {
		if (operation === 'getAll') {
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
			return listOrAll.call(this, i, '/leads', 'items', filters, 'offset');
		}
		if (operation === 'get') {
			const leadId = encodeURIComponent(this.getNodeParameter('leadId', i) as string);
			return nuwayApiRequest.call(this, 'GET', `/leads/${leadId}`);
		}
	}

	if (resource === 'teamMember' && operation === 'getAll') {
		const response = await nuwayApiRequest.call(this, 'GET', '/team-members');
		return (response.team_members as IDataObject[]) || [];
	}

	if (resource === 'meeting') {
		if (operation === 'getAll') {
			const filters = { ...(this.getNodeParameter('filters', i, {}) as IDataObject) };
			if (filters.start_date) filters.start_date = toDay(filters.start_date);
			if (filters.end_date) filters.end_date = toDay(filters.end_date);
			if (filters.team_member_email) {
				filters.team_member_email = String(filters.team_member_email)
					.split(',')
					.map((email) => email.trim())
					.filter(Boolean);
			}
			const response = await nuwayApiRequest.call(this, 'GET', '/meetings', undefined, filters);
			return (response.meetings as IDataObject[]) || [];
		}
		if (operation === 'getAvailability') {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			return nuwayApiRequest.call(this, 'GET', '/meetings/availability', undefined, {
				host_email: this.getNodeParameter('hostEmail', i) as string,
				date: toDay(this.getNodeParameter('date', i)),
				timezone: this.getNodeParameter('timezone', i) as string,
				...options,
			});
		}
		if (operation === 'cancel') {
			const meetingId = encodeURIComponent(this.getNodeParameter('meetingId', i) as string);
			const reason = this.getNodeParameter('reason', i, '') as string;
			return nuwayApiRequest.call(this, 'POST', `/meetings/${meetingId}/cancel`, { reason });
		}
	}

	if (resource === 'knowledge') {
		if (operation === 'getAll') {
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
			return listOrAll.call(this, i, '/knowledge', 'content', filters, 'page');
		}
		if (operation === 'uploadDocument') {
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
			const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
			const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
			// The form-data package rather than the global FormData: n8n reads its
			// multipart headers, and older n8n releases drop a global FormData body.
			const form = new FormData();
			form.append('file', buffer, {
				filename: binaryData.fileName || 'document',
				contentType: binaryData.mimeType || 'application/octet-stream',
			});
			return nuwayApiRequest.call(this, 'POST', '/knowledge/documents', form);
		}
		if (operation === 'addFaq' || operation === 'updateFaq') {
			const body = {
				question: this.getNodeParameter('question', i) as string,
				answer: this.getNodeParameter('answer', i) as string,
			};
			if (operation === 'addFaq') {
				return nuwayApiRequest.call(this, 'POST', '/knowledge/faqs', body);
			}
			const resourceId = encodeURIComponent(this.getNodeParameter('resourceId', i) as string);
			return nuwayApiRequest.call(this, 'PUT', `/knowledge/faqs/${resourceId}`, body);
		}
		if (operation === 'delete') {
			const resourceId = encodeURIComponent(this.getNodeParameter('resourceId', i) as string);
			return nuwayApiRequest.call(this, 'DELETE', `/knowledge/${resourceId}`);
		}
	}

	throw new Error(`The operation "${operation}" is not supported for "${resource}"`);
}

async function listOrAll(
	this: IExecuteFunctions,
	i: number,
	endpoint: string,
	listKey: string,
	filters: IDataObject,
	paging: 'offset' | 'page',
): Promise<IDataObject[]> {
	if (this.getNodeParameter('returnAll', i) as boolean) {
		return nuwayApiRequestAllItems.call(this, endpoint, listKey, filters, paging);
	}
	const limit = this.getNodeParameter('limit', i) as number;
	const qs = paging === 'page' ? { ...filters, page: 0, size: limit } : { ...filters, limit, offset: 0 };
	const response = await nuwayApiRequest.call(this, 'GET', endpoint, undefined, qs);
	return (response[listKey] as IDataObject[]) || [];
}
