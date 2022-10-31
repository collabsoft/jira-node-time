// @ts-check
import React, { useEffect, useState } from 'react';
import { requestJira } from '@forge/bridge';
import IssueGraph from './components/IssueGraph';
import JntDropper from './components/JntDropper';
import './App.css';

/**
 * @param {string[]} fields
 */
async function fetchEpics(fields) {
    return await requestJira(`/rest/api/2/search?${
        new URLSearchParams({
            jql: `issuetype=Epic`,
            fields: fields.join(','),
        })
    }`).then(res => res.json());
};

/**
 * 
 * @param {string} issueKey 
 */
async function fetchSlice(issueKey) {
    return await requestJira(`/rest/api/2/search?${
        new URLSearchParams({
            jql: `key="${issueKey}" OR parent="${issueKey}"`,
        })
    }`).then(res => res.json());
}

function App() {
    const [activeEpic, setActiveEpic] = useState('MP-6');
    
    const [activeIssues, setActiveIssues] = useState([]);
    useEffect(async () => {
        console.log(`Fetching slice for ${activeEpic}`);
        const resp = await fetchSlice(activeEpic);
        setActiveIssues(resp.issues);
    }, [activeEpic]);
    
    const [possibleEpics, setPossibleEpics] = useState(/** @type {Array|null} */(null));
    useEffect(async () => {
        const resp = await fetchEpics(['key', 'summary']);
        setPossibleEpics(resp.issues);
    });

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <div className="app__controls">
                <JntDropper
                    label="Epic"
                    icon="https://api.atlassian.com/ex/jira/54ac5212-e260-465b-8d41-2628d6d8de8e/rest/api/2/universal_avatar/view/type/issuetype/avatar/10307?size=medium"
                    value={activeEpic}
                    onChange={setActiveEpic}
                    loading={!possibleEpics}
                    options={possibleEpics?.map(issue => ({
                        value: issue.key,
                        label: issue.fields.summary,
                    })) ?? []}
                />
            </div>
            <hr />
            <div style={{ height: '100%' }}>
                {activeIssues.length ? (<IssueGraph issues={activeIssues} />) : 'Loading...'}
            </div>
        </div>
    );
}

export default App;
