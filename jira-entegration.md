-   Everyday get all projects of user
-   Get Project spesific branches
-   See wakatime-project.json for sample data
-   Run regex on branch names to detect "BIZ-XXX-" structure
-   With JIRA API find issue with the key "BIZ-XXX"
-   If issues exists
    -   and does not have status "Done"
    -   and in a active sprint
        -   add worklog

Additional

-   Add user interface to specify
    -   git repo names
    -   jira project names
    -   active/disable

https://saportif.atlassian.net/rest/api/2/issue/BIZ-302/worklog

https://wakatime.com/api/v1/users/current/summaries?range=yesterday&project=bizworld-portal-api
