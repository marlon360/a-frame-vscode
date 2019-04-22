'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let primitives = ['a-box', 'a-camera', 'a-circle', 'a-collada-model', 'a-cone',
		'a-cursor', 'a-curvedimage', 'a-cylinder', 'a-dodecahedron', 'a-gltf-model', 'a-icosahedron',
		'a-image', 'a-light', 'a-link', 'a-obj-model', 'a-octahedron', 'a-plane', 'a-ring', 'a-sky',
		'a-sound', 'a-sphere', 'a-tetrahedron', 'a-text', 'a-torus-knot', 'a-torus', 'a-triangle',
		'a-video', 'a-videosphere'];

	let provider1 = vscode.languages.registerCompletionItemProvider('html', {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			let items = new Array<vscode.CompletionItem>();

			primitives.forEach((primitive) => {
				const simpleCompletion = new vscode.CompletionItem(primitive);
				simpleCompletion.insertText = new vscode.SnippetString('<' + primitive + '>${1}</' + primitive + '>');
				items.push(simpleCompletion);
			})

			return items;
		},
	}, 'a', 'a-');

	context.subscriptions.push(provider1);


}
