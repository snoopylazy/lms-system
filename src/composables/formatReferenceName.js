export const getReferenceName = (id, ArrayData, fieldName) => {
    const findName = ArrayData.find((d) => d._id === id);
    return findName ? findName[fieldName] || '' : ''; // Explicitly return empty string if not found
};
