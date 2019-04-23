const markdownJson = require('markdown-json');
const tabletojson = require('tabletojson');
var TurndownService = require('turndown');

var turndownService = new TurndownService();

const fs = require('fs');

const settings = {
	name: 'markdown-json',
	cwd: './',
	src: 'node_modules/aframe/docs/primitives/',
	filePattern: '*.md',
	ignore: "test",
	dist: 'parser/output.json',
	server: false,
	port: 3001
};

markdownJson(settings).then((data) => {
	
	let json = {
		elements: []
	};
	for (const el of Object.keys(data)) {
		let element = {};
		element["tag"] = data[el].id;
		element["description"] = turndownService.turndown(data[el].excerpt);
		element["attributes"] = [];
		const attributes = tabletojson.convert(data[el].contents);
		for (const attribute of attributes[0]) {
			let newAttribute = {
				name: attribute['Attribute'],
				componentMapping: attribute['Component Mapping'],
				default: attribute['Default Value']
			}
			element["attributes"].push(newAttribute);
		}
		json.elements.push(element);
	}
	fs.writeFile('src/data/elements.json', JSON.stringify(json, null, 2),(err) => {  
		if (err) throw err;
		console.log('Data written to file');
	});  
	
}).catch((err) => {
	console.log('error:', err);
})