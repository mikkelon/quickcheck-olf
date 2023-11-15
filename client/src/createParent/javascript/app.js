export const parents = [
    // {
    //     id: 1,
    //     name: 'Parent 1',
    //     phone: '1234567890',
    //     email: 'parent@email.com'
    // }
];
export const children = [];

export function addParent(parent) {
    parents.push(parent);
}

export function addChild(child) {
    children.push(child);
}

export function removeParent(parent) {
    const index = parents.indexOf(parent);

    if (index > -1) {
        parents.splice(index, 1);
    }
}

export function removeChild(child) {
    const index = children.indexOf(child);

    if (index > -1) {
        children.splice(index, 1);
    }
}