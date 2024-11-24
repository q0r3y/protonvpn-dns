export default {
	async scheduled(event, env) {
		const { zoneId, recordId, authToken, vpnNodesDb, cloudflareEmail } = env;
		const cloudflareUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`;
		const queryRandomAddress = `SELECT * FROM protonVpnNodesUs ORDER BY RANDOM() LIMIT 1`;
		const vpnNodeUs = await vpnNodesDb.prepare(queryRandomAddress).first();
		const dateTime = new Date().toISOString();

		const requestData = {
			comment: `${dateTime}: Worker updated node address.`,
			name: 'us.protonvpn',
			proxied: false,
			settings: {},
			tags: [],
			ttl: 60,
			content: vpnNodeUs.ipAddress,
			type: 'A',
		};

		const headers = {
			'Content-Type': 'application/json',
			'X-Auth-Email': cloudflareEmail,
			Authorization: `Bearer ${authToken}`,
		};

		await fetch(cloudflareUrl, {
			method: 'PATCH',
			headers: headers,
			body: JSON.stringify(requestData),
		})
			.then((response) => response.json())
			.then((data) => console.log('Success:', data))
			.catch((error) => console.error('Error:', error));
	},
};
