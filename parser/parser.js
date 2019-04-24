const markdownJson = require('markdown-json');
const tabletojson = require('tabletojson');
var TurndownService = require('turndown');

var turndownService = new TurndownService();

const fs = require('fs');

const settingsPrimitives = {
	name: 'markdown-json',
	cwd: './',
	src: 'node_modules/aframe/docs/primitives/',
	filePattern: '*.md',
	ignore: "test",
	dist: 'parser/output.json',
	server: false,
	port: 3001
};

const settingsComponents = {
	name: 'markdown-json',
	cwd: './',
	src: 'node_modules/aframe/docs/components/',
	filePattern: '*.md',
	ignore: "test",
	dist: 'parser/outputComponents.json',
	server: false,
	port: 3001
};

markdownJson(settingsPrimitives).then((data) => {

	markdownJson(settingsComponents).then((components) => {

		let parsedComponents = [];
		for (const comp of Object.keys(components)) {
			const newComp = {};
			newComp["name"] = components[comp].id;
			newComp["description"] = turndownService.turndown(components[comp].excerpt);
			parsedComponents.push(newComp);
		}

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
					description: "Component Mapping: `" + attribute['Component Mapping'] + "` \n\n Default: `" + attribute['Default Value'] + "`",
					default: attribute['Default Value']
				}
				element["attributes"].push(newAttribute);
			}
			for (const parsedComp of parsedComponents) {
				let newAttribute = {
					name: parsedComp.name,
					description: parsedComp.description,
					default: ""
				}
				element["attributes"].push(newAttribute);
			}
			json.elements.push(element);
		}
		let element = {};
		element["tag"] = "a-entity";
		element["description"] = "";
		element["attributes"] = [];
		for (const parsedComp of parsedComponents) {
			let newAttribute = {
				name: parsedComp.name,
				description: parsedComp.description,
				default: ""
			}
			element["attributes"].push(newAttribute);
		}
		json.elements.push(element);
		fs.writeFile('src/data/elements.json', JSON.stringify(json, null, 2), (err) => {
			if (err) throw err;
			console.log('Data written to file');
		});

	})

}).catch((err) => {
	console.log('error:', err);
})