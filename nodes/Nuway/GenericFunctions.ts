import type FormData from 'form-data';
import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';

// Only types come from n8n-workflow. Importing its classes at runtime would
// make npm install it next to the node, and its 2.x releases build a native
// module that fails on machines without C++ build tools.

// The API's per-request maximum for paged lists.
const PAGE_SIZE = 200;

export async function nuwayApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject | FormData,
	qs: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('nuwayApi');
	const baseUrl = String(credentials.baseUrl || 'https://ai.nuway.co').replace(/\/+$/, '');

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}/api/v1/external${endpoint}`,
		qs: dropEmpty(qs),
		// FastAPI reads a list as a repeated key: team_member_email=a&team_member_email=b
		arrayFormat: 'repeat',
		json: true,
	};
	if (body !== undefined) {
		options.body = body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'nuwayApi', options);
	} catch (error) {
		// n8n raises a NodeApiError whose description is only "Request failed with
		// status code 422"; the API says what was wrong in `detail`.
		const detail = apiDetail(error);
		if (detail && error && typeof error === 'object') {
			(error as { description?: string }).description = detail;
		}
		throw error;
	}
}

function apiDetail(error: any): string | undefined {
	const data = error?.context?.data ?? error?.cause?.response?.data;
	const detail = data?.detail;
	if (typeof detail === 'string') return detail;
	// 402: {"error": "insufficient_balance", "message": "..."}
	if (detail && typeof detail.message === 'string') return detail.message;
	// FastAPI validation: [{"loc": ["query", "date"], "msg": "..."}]
	if (Array.isArray(detail)) {
		return detail
			.map((d: IDataObject) => `${((d.loc as string[]) || []).slice(1).join('.')}: ${d.msg}`)
			.join('; ');
	}
	return undefined;
}

/**
 * Every record of a paged list.
 *
 * Conversations and leads page by limit/offset and say has_more; knowledge
 * pages by page/size and says totalPages.
 */
export async function nuwayApiRequestAllItems(
	this: IExecuteFunctions,
	endpoint: string,
	listKey: string,
	qs: IDataObject = {},
	paging: 'offset' | 'page' = 'offset',
): Promise<IDataObject[]> {
	const records: IDataObject[] = [];

	if (paging === 'page') {
		let page = 0;
		let totalPages = 1;
		while (page < totalPages) {
			const response = await nuwayApiRequest.call(this, 'GET', endpoint, undefined, {
				...qs,
				page,
				size: PAGE_SIZE,
			});
			records.push(...((response[listKey] as IDataObject[]) || []));
			totalPages = Number(response.totalPages) || 0;
			page++;
		}
		return records;
	}

	let offset = 0;
	let hasMore = true;
	while (hasMore) {
		const response = await nuwayApiRequest.call(this, 'GET', endpoint, undefined, {
			...qs,
			limit: PAGE_SIZE,
			offset,
		});
		const pageRecords = (response[listKey] as IDataObject[]) || [];
		records.push(...pageRecords);
		offset += pageRecords.length;
		hasMore = Boolean(response.has_more) && pageRecords.length > 0;
	}
	return records;
}

function dropEmpty(qs: IDataObject): IDataObject {
	const out: IDataObject = {};
	for (const [key, value] of Object.entries(qs)) {
		if (value !== undefined && value !== null && value !== '') {
			out[key] = value;
		}
	}
	return out;
}

/** YYYY-MM-DD from an n8n date field, which may carry a time. */
export function toDay(value: unknown): string {
	return String(value ?? '').slice(0, 10);
}
