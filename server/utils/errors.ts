export function getErrorStatus(err: unknown, fallback = 500): number {
    const value = err as { statusCode?: number } | undefined;
    return typeof value?.statusCode === "number" ? value.statusCode : fallback;
}

export function getErrorMessage(err: unknown, fallback = "Internal Server Error"): string {
    if (err instanceof Error) return err.message;

    const value = err as { statusMessage?: string; message?: string } | undefined;
    if (typeof value?.statusMessage === "string") return value.statusMessage;
    if (typeof value?.message === "string") return value.message;
    if (typeof err === "string") return err;
    return fallback;
}