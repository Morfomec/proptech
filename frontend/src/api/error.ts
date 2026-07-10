import axios from "axios";

export function getApiErrorMessage(error: unknown): string {
    // Not an Axios error
    if (!axios.isAxiosError(error)) {
        return "Something went wrong.";
    }

    // No response -> network/server unavailable
    if (!error.response) {
        return "Unable to connect to the server. Please check your internet connection.";
    }

    const { status, data } = error.response;

    // Never expose Django debug pages
    if (status >= 500) {
        return "Something went wrong on our server. Please try again later.";
    }

    // DRF {"detail": "..."}
    if (typeof data?.detail === "string") {
        return data.detail;
    }

    // DRF {"message": "..."}
    if (typeof data?.message === "string") {
        return data.message;
    }

    // DRF field errors
    if (typeof data === "object" && data !== null) {
        const firstKey = Object.keys(data)[0];

        if (firstKey) {
            const value = data[firstKey];

            if (Array.isArray(value)) {
                return value[0];
            }

            if (typeof value === "string") {
                return value;
            }
        }
    }

    return "Something went wrong.";
}