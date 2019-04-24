'use strict';

import * as vscode from 'vscode';

import data from './data/elements.json';

export function activate(context: vscode.ExtensionContext) {


	let tagProvider = vscode.languages.registerCompletionItemProvider('html', {


		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			// all items
			let items = new Array<vscode.CompletionItem>();

			// elements in json file
			let elements = (<any>data).elements;

			// add completion for each element
			elements.forEach((element) => {
				// new completion with element tag
				const completion = new vscode.CompletionItem(element.tag);
				// insert element tag with tags
				completion.insertText = new vscode.SnippetString('<' + element.tag + '>${1}</' + element.tag + '>');
				// add documentation
				completion.documentation = new vscode.MarkdownString("*A-Frame Primitive: " + element.tag + "*\n\nDescription: \n" + element.description);

				// test if an open tag was already written
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				let openTag = linePrefix.lastIndexOf('<');
				let closeTag = linePrefix.lastIndexOf('>');
				// delete the open tag if duplicate
				if (openTag > closeTag) {
					let range = new vscode.Range(document.lineAt(position).lineNumber, openTag, document.lineAt(position).lineNumber, openTag + 1);
					completion.additionalTextEdits = [vscode.TextEdit.delete(range)]
				}
				// add completion to array
				items.push(completion);
			})

			return items;
		},
	}, 'a', 'a-');

	const attributeProvider = vscode.languages.registerCompletionItemProvider(
		'html',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				let completions = [];
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				linePrefix = linePrefix.substr(linePrefix.lastIndexOf('<'), position.character);

				let elements = (<any>data).elements;
				elements.forEach((element) => {
					let itemIndex = linePrefix.indexOf('<' + element.tag + ' ');
					let closingTagIndex = linePrefix.indexOf('>')
					if (itemIndex === -1 || closingTagIndex > itemIndex) {
						return undefined;
					}
					element.attributes.forEach((attribute) => {
						const comp = new vscode.CompletionItem(attribute.name, vscode.CompletionItemKind.Method)
						comp.insertText = new vscode.SnippetString(attribute.name + '="' + '${1:' + attribute.default + '}"');
						comp.documentation = new vscode.MarkdownString(attribute.description);
						completions.push(comp);
					})

				})

				return completions;
			}
		},
		' ' // triggered whenever a ' ' is being typed
	);

	const registerProvider = vscode.languages.registerCompletionItemProvider(
		'javascript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {


				let snippet = `AFRAME.registerComponent('\${1}', {
	schema: {
		\${0}
	},

	init: function () {
	  // Do something when component first attached.
	},

	update: function () {
	  // Do something when component's data is updated.
	},

	remove: function () {
	  // Do something the component or its entity is detached.
	},

	tick: function (time, timeDelta) {
	  // Do something on every scene tick or frame.
	}
});
`;

				const completion = new vscode.CompletionItem('AFRAME.registerComponent', vscode.CompletionItemKind.Snippet);
				completion.insertText = new vscode.SnippetString(snippet);
				completion.documentation = new vscode.MarkdownString("*A-Frame Register Component* ");


				return [completion];
			}
		}
	);
	const exampleProvider = vscode.languages.registerCompletionItemProvider(
		'html',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {


				let snippet = `<a-scene background="color: #FAFAFA">
	<a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" shadow></a-box>
	<a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" shadow></a-sphere>
	<a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D" shadow></a-cylinder>
	<a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4" shadow></a-plane>
</a-scene>
`;

				const completion = new vscode.CompletionItem('a-scene:example', vscode.CompletionItemKind.Snippet);
				completion.insertText = new vscode.SnippetString(snippet);
				completion.documentation = new vscode.MarkdownString("*A-Frame Scene Example* ");


				return [completion];
			}
		}
	);

	context.subscriptions.push(tagProvider, attributeProvider, registerProvider, exampleProvider);

}
