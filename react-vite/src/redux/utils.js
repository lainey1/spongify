export const normalizer = (arr) =>
    arr.reduce((obj, el) => {
        obj[el.id] = el;
        return obj;
    }, {});
