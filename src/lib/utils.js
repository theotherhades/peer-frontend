// @ts-nocheck

/**
 * Converts HTML form data into JSON data.
 * @param {*} unparsedFormData The original form's data.
 * @returns A JSON object containing the form's data.
 */
export function parseForm(unparsedFormData) {
    const formData = new FormData(unparsedFormData.target);
    const parsedFormData = {};
    for (const field of formData) {
        const [k, v] = field;
        parsedFormData[k] = v;
    }
    return parsedFormData;
}