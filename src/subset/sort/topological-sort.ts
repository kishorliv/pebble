export function topologicalSort(graph: { [key: string]: string[] }): string[] | null {
	const numVertices = Object.keys(graph).length;
	const inDegree: { [key: string]: number } = {};
	const sortedGraph: string[] = [];
	const queue: string[] = [];
	let nodeVisitCount: number = 0;

	// calculate in degree of each node
	for (const key of Object.keys(graph)) {
		inDegree[key] = graph[key].length;
	}

	// queue containing nodes with 0 in-degree
	for (const [key, val] of Object.entries(inDegree)) {
		if (val === 0) {
			queue.push(key);
		}
	}

	while (queue.length) {
		nodeVisitCount++;

		const firstItem = queue[0];
		queue.shift();

		sortedGraph.push(firstItem);

		// reduce in-degrees of neighbors
		for (const key of Object.keys(graph)) {
			inDegree[key]--;
			if (inDegree[key] === 0) {
				queue.push(key);
			}
		}
	}

	// cycle exists in the graph
	if (nodeVisitCount !== numVertices) {
		console.error('Cycle exists in the graph!');
		return null;
	}

	return sortedGraph;
}
