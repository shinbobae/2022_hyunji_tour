export const toQueryString = (object: any) => {
    const queryString = new URLSearchParams(object).toString();
    if (queryString.length > 0) {
        return `?${queryString}`;
    } else {
        return '';
    }
};
