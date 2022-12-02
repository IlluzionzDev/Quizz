function getHost(value: string | undefined): string {
    if (!value || value === 'origin') {
        let host = window.location.origin.replace(/^https/, 'wss').replace(/^http/, 'ws');
        return host;
    } else {
        return value;
    }
}

// WebSocket host server
export const HOST = getHost(process.env.HOST);
