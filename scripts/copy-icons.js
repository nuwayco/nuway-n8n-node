// tsc only emits .js; n8n loads the node's icon from next to the compiled node.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function copyIcons(dir) {
	for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
		const rel = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			copyIcons(rel);
		} else if (/\.(png|svg)$/.test(entry.name)) {
			const target = path.join(root, 'dist', rel);
			fs.mkdirSync(path.dirname(target), { recursive: true });
			fs.copyFileSync(path.join(root, rel), target);
		}
	}
}

copyIcons('nodes');
copyIcons('credentials');
