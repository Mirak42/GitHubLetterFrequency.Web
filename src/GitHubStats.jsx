import React, { useState, useEffect } from "react";
import reactLogo from './assets/react.svg'
import { Octokit } from "@octokit/rest";

const GitHubStats = () => {
    const [letterFrequencies, setLetterFrequencies] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize Octokit.
    const initializeOctokit = () => {
        return new Octokit({
            // Set the access token from an environment variable.
            auth: process.env.REACT_APP_GITHUB_TOKEN,
        });
    };

    // Get the whole repository tree structure and extract desired files.
    const fetchGitHubRepositoryTree = async (octokit) => {
        const response = await octokit.git.getTree({
            owner: "lodash",
            repo: "lodash",
            tree_sha: "main", // Focusing on the main branch.
            recursive: true, // Include all files and subdirectories.
        });

        // Return only JavaScript and TypeScript files.
        return response.data.tree
            .filter(node => node.type === "blob" && (node.path.endsWith(".js") || node.path.endsWith(".ts")))
            .map(node => node.path);
    };

    // Get the file contents using their path.
    const fetchFileContent = async (octokit, file) => {
        const fileContent = await octokit.repos.getContent({
            owner: "lodash",
            repo: "lodash",
            path: file,
        });
        return atob(fileContent.data.content); // Decode content from base64.
    };

    // Count occurrences of each letter.
    const countLetterOccurrences = (content, letterOccurrences) => {
        for (const char of content) {
            // Using a simple regex here to match latin letters only.
            // Could be extended to match more complex characters such as accented letters.
            if (/[a-zA-Z]/.test(char)) {
                const letter = char.toLowerCase();
                letterOccurrences[letter] = (letterOccurrences[letter] || 0) + 1;
            }
        }
    };

    // Get all JavaScript and TypeScript files from the lodash/lodash GitHub repository.
    // Analyze occurrences of each letter.
    const fetchGitHubRepositoryData = async () => {
        try {
            const octokit = initializeOctokit();

            // Get all matching repository files.
            const jsTsfiles = await fetchGitHubRepositoryTree(octokit);

            // Get all file contents in parallel.
            const fileContents = await Promise.all(
                jsTsfiles.map(file => fetchFileContent(octokit, file))
            );

            // Count letter frequencies on each file content.
            const letterOccurrences = {};
            fileContents.forEach((content) =>
                countLetterOccurrences(content, letterOccurrences)
            );

            // Update state.
            setLetterFrequencies(letterOccurrences);
        } catch (err) {
            console.error("Error fetching stats data:", err);
            setError("Failed to fetch stats data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGitHubRepositoryData();
    }, []);

    // Display the letter frequency statistics using a table in decreasing order.
    const renderStats = () => {
        if (error) {
            return <div>{error}</div>;
        }

        if (loading) {
            return (
                <div>
                    <img src={reactLogo} className="logo react" alt="React logo" />
                    <p>Loading...</p>
                </div>
            );
        }

        const sortedLetterFrequencies = Object.entries(letterFrequencies)
            .sort(([, a], [, b]) => b - a)
            .map(([letter, frequency]) => (
                <tr key={letter}>
                    <td>{letter}</td>
                    <td>{frequency}</td>
                </tr>
            ));

        return (
            <table>
                <thead>
                    <tr>
                        <th>Letter</th>
                        <th>Occurrences</th>
                    </tr>
                </thead>
                <tbody>{sortedLetterFrequencies}</tbody>
            </table>
        );
    };

    return (
        <div>
            <h1>GitHub Stats - lodash/lodash repository</h1>
            {renderStats()}
        </div>
    );
};

export default GitHubStats;
