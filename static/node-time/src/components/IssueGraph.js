// @ts-check
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { Controls, Background, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import JiraIssueNode from './JiraIssueNode';'./JiraIssueNode.js';


/**
 * @param {Array} issues 
 * @returns {{nodes: import('reactflow').Node<any>[], edges: import('reactflow').Edge<any>[]}}
 */
function issuesToGraph(issues) {
    const nodes = issues.map((issue, i) => {
        return {
            id: issue.key,
            position: { x: i * 100, y: i * 100 },
            type: 'jiraIssueNode',
            data: {
                label: issue.key,
                issue,
            },
        }
    });

    const seenLinks = new Set();
    const edges = issues.flatMap(issue => {
        return issue.fields.issuelinks
            .filter(link => link.type.name == 'Blocks')
            .map(link => {
                if (link.outwardIssue) {
                    const id = `${issue.key}::${link.outwardIssue.key}`;
                    if (seenLinks.has(id)) return;
                    seenLinks.add(id);
                    return /** @type {import('reactflow').Edge<any>} */({
                        id,
                        source: issue.key,
                        target: link.outwardIssue.key,
                        data: {
                            label: link.type.name,
                        },
                    });
                } else if (link.inwardIssue) {
                    const id = `${link.inwardIssue.key}::${issue.key}`;
                    if (seenLinks.has(id)) return;
                    seenLinks.add(id);
                    return /** @type {import('reactflow').Edge<any>} */({
                        id,
                        source: link.inwardIssue.key,
                        target: issue.key,
                        data: {
                            label: link.type.name,
                        },
                    });
                } else {
                    throw new Error('Invalid issue link');
                }
        });
    })
    .filter(link => link);

    // Mark epics as blocked by their subitems, but
    // only by subtasks which do no block anything else. This keeps the graph tidy
    const epicKeys = new Set(issues.map(issue => issue.fields.parent?.key));
    for (const epicKey of epicKeys) {
        const issuesToLink = issues
            .filter(issue => (
                issue.fields.parent?.key == epicKey && 
                !edges.find(edge => edge.source == issue.key)
            ));
        for (const blocker of issuesToLink) {
            edges.push({
                id: `${blocker.key}::${epicKey}`,
                source: blocker.key,
                target: epicKey,
            });
        }
    }

    return {nodes, edges};
}

const DEFAULT_POSITION_OPTS = {
    nodeWidth: 200,
    nodeHeight: 100,
    gapVertical: 100,
    gapHorizontal: 50,
}

/**
 * @param {import('reactflow').Node<any>[]} nodes
 * @param {import('reactflow').Edge<any>[]} edges
 */
function alignNodesToColumns(nodes, edges, positionOptions=DEFAULT_POSITION_OPTS) {
    const seen = new Set();
    let todo = nodes;
    /** @type {import('reactflow').Node<any>[][]} */
    const columns = [];
    while (todo.length) {
        // Want the first column to be nodes with no incoming edges
        const nextColumn = todo.filter(node => {
            // Does there exist a node for which this is the target?
            // If so this is still blocked.
            const hasUnseenParent = edges.find(edge => edge.target === node.data.issue.key && !seen.has(edge.source));
            return !hasUnseenParent;
        });
        columns.push(nextColumn);
        nextColumn.forEach(node => seen.add(node.data.issue.key));
        todo = todo.filter(node => !seen.has(node.data.issue.key));
    }
    
    for (const [colIndex, col] of columns.entries()) {
        // sort each column by descending number of outward edges
        const colSorted = col.sort((a, b) => {
            const aOutwardEdges = edges.filter(edge => edge.source === a.data.issue.key);
            const bOutwardEdges = edges.filter(edge => edge.source === b.data.issue.key);
            return bOutwardEdges.length - aOutwardEdges.length;
        });
        for (const [rowIndex, node] of colSorted.entries()) {
            node.position = {
                x: colIndex * (positionOptions.nodeWidth + positionOptions.gapVertical),
                y: rowIndex * (positionOptions.nodeHeight + positionOptions.gapHorizontal),
            };
        }
    }


}

/**
 * @param {object} props
 * @param {Array} props.issues
 */
function IssueGraph(props) {
    const [nodes, setNodes] = useState(/** @type {import('reactflow').Node<any>[]} */([]));
    const [edges, setEdges] = useState(/** @type {import('reactflow').Edge<any>[]} */([]));
    useEffect(() => {
        const {nodes: _nodes, edges: _edges} = issuesToGraph(props.issues);
        alignNodesToColumns(_nodes, _edges);
        setNodes(_nodes);
        setEdges(_edges);
    }, [props.issues]);

    const onNodesChange = useCallback((changes) => setNodes(applyNodeChanges(changes, nodes)), []);
    const onEdgesChange = useCallback((changes) => setEdges(applyEdgeChanges(changes, edges)), []);

    const nodeTypes = useMemo(() => ({ jiraIssueNode: JiraIssueNode }), []);
    return (
        <ReactFlow
            nodes={nodes}
            // onNodesChange={onNodesChange}
            edges={edges}
            // onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
        >
            <Background />
            <Controls />
        </ReactFlow>
    );
}

export default IssueGraph;
