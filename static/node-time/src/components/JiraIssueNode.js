import { ViewIssueModal } from '@forge/jira-bridge';
import { Handle, Position } from 'reactflow';
import './JiraIssueNode.css';

function JiraIssueNode({ data }) {
    const issue = data.issue;

    const openIssueModal = (ev) => {
        ev.preventDefault();
        new ViewIssueModal({context: { issueKey: issue.key }}).open();
    };
    return (
        <div
            className="jira-issue-node"
            data-status={issue.fields.status.statusCategory.key}
            data-type={issue.fields.issuetype.name}
        >
            <Handle type="target" position={Position.Left} />
            <header>
                {
                    issue.fields.assignee ? (
                        <img
                            className="jira-issue-node__avatar"
                            src={issue.fields.assignee.avatarUrls['48x48']}
                            title={issue.fields.assignee.displayName}
                        />
                    ) :
                    (
                        <svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fillRule="evenodd"><path d="M6 14c0-1.105.902-2 2.009-2h7.982c1.11 0 2.009.894 2.009 2.006v4.44c0 3.405-12 3.405-12 0V14z"></path><circle cx="12" cy="7" r="4"></circle></g></svg>
                    )
                }
                <div className="jira-issue-node__status">
                    {issue.fields.status.name}
                </div>
                <div style={{flex: 1}}></div>
                <img
                    src={issue.fields.issuetype.iconUrl}
                    title={issue.fields.issuetype.name}
                />
                <a
                    href={`/browse/${issue.key}`}
                    onClick={openIssueModal}
                >{issue.key}</a>
            </header>
            <div className="jira-issue-node__summary">{issue.fields.summary}</div>
            <Handle type="source" position={Position.Right}/>
        </div>);
}

export default JiraIssueNode;
