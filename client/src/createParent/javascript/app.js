const MAX_PARENTS = 4;
const parents = [];

export function addParent(parent) {
    if (!canCreateParent) {
        return;
    }
    
    parents.push(parent);
}

export function canCreateParent() {
    return parents.length < MAX_PARENTS;
}