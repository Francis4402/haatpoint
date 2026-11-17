export function parseVariantList(value?: string | null): string[] {
    if (!value) return [];

    let rawItems: string[] = [];
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            rawItems = parsed.filter((v): v is string => typeof v === 'string');
        } else if (typeof parsed === 'string' && parsed.trim() !== '') {
            rawItems = [parsed.trim()];
        }
    } catch {
        const trimmed = String(value).trim();
        if (trimmed && trimmed !== '[]' && trimmed !== '""' && trimmed !== 'null') {
            rawItems = [trimmed.replace(/^"|"$/g, '')];
        }
    }

    // Split any items containing commas, slashes, or pipes into individual distinct options
    const result: string[] = [];
    for (const item of rawItems) {
        const parts = item
            .split(/[,/|]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0 && s !== '""' && s !== "''");
        result.push(...parts);
    }

    // Deduplicate while preserving case and strip any placeholder/legacy text like "as shown in image"
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const v of result) {
        if (/shown in image/i.test(v)) {
            continue;
        }
        const key = v.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(v);
        }
    }

    return unique;
}
