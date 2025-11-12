import { Quiz, GitSettings } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

const atob_utf8 = (b64: string) => {
    return decodeURIComponent(
        atob(b64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
    );
};

const btoa_utf8 = (str: string) => {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
            String.fromCharCode(parseInt(p1, 16)),
        ),
    );
};


async function githubApiRequest(url: string, settings: GitSettings, options: RequestInit = {}) {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${settings.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${response.status} ${errorData.message || 'Unknown error'}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export const getFile = async (settings: GitSettings): Promise<{ content: Quiz[], sha: string }> => {
    const { username, repo, path } = settings;
    const url = `${GITHUB_API_BASE}/repos/${username}/${repo}/contents/${path}`;
    const data = await githubApiRequest(url, settings);

    const content = JSON.parse(atob_utf8(data.content));
    return { content, sha: data.sha };
};

export const updateFile = async (
    settings: GitSettings,
    content: Quiz[],
    message: string,
    sha: string | null
): Promise<{ sha: string }> => {
    const { username, repo, path } = settings;
    const url = `${GITHUB_API_BASE}/repos/${username}/${repo}/contents/${path}`;
    
    const body = {
        message,
        content: btoa_utf8(JSON.stringify(content, null, 2)),
        sha,
    };

    const response = await githubApiRequest(url, settings, {
        method: 'PUT',
        body: JSON.stringify(body),
    });

    return { sha: response.content.sha };
};