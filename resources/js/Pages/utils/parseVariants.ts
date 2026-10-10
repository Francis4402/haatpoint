export function parseVariantList(value?: string | null): string[] {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            return parsed
                .filter((v): v is string => typeof v === 'string')
                .map((v) => v.trim())
                .filter((v) => v !== '');
        }
        if (typeof parsed === 'string' && parsed.trim() !== '') {
            return [parsed.trim()];
        }
        return [];
    } catch {
        const trimmed = String(value).trim();
        if (!trimmed || trimmed === '[]' || trimmed === '""') return [];
        return [trimmed.replace(/^"|"$/g, '')];
    }
}
