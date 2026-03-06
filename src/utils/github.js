import { Octokit } from "octokit";

export const gitPush = async (token, content, path, owner, repo) => {
    const octokit = new Octokit({ auth: token });

    // Get current file to get the SHA
    try {
        const { data: fileData } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path,
        });

        // Commit changes
        const { data: updateData } = await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: `nexus-db: update ${new Date().toISOString()}`,
            content: btoa(JSON.stringify(content, null, 2)), // Base64 encode
            sha: fileData.sha,
        });

        return updateData;
    } catch (error) {
        console.error("GitPush failed:", error);
        throw error;
    }
};
