// app.js

import {
    createParent,
    createChild,
    getAllParents,
    getAllChildren,
    updateParent,
    updateChild,
    deleteParent,
    deleteChild
} from './crud.js';

// Example usage:
// Create parents
const parent1 = createParent('Parent 1', '123456789', 'parent1@example.com');
const parent2 = createParent('Parent 2', '987654321', 'parent2@example.com');

// Create children
const child1 = createChild('Child 1', 'Grade 1', '2023-01-01');
const child2 = createChild('Child 2', 'Grade 2', '2023-02-01');

// Get all parents and children
const allParents = getAllParents();
const allChildren = getAllChildren();

console.log('All Parents:', allParents);
console.log('All Children:', allChildren);

// Update parent
const updatedParent = updateParent(0, { phone: '999999999' });
console.log('Updated Parent:', updatedParent);

// Delete child
const deletedChild = deleteChild(0);
console.log('Deleted Child:', deletedChild);

// Get all children after deletion
const childrenAfterDeletion = getAllChildren();
console.log('Children After Deletion:', childrenAfterDeletion);
