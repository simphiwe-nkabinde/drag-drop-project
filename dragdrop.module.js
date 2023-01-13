// PLACEMENT GUIDES
const GUIDELINE = document.createElement('div');
GUIDELINE.id = 'guideline';
GUIDELINE.style.margin = '2px auto';
GUIDELINE.style.border = '1px solid #c80cce';

function showPlacementGuides(event) {
    const target = event.target
    if (target.id == 'guideline') return
    const workingElement = isVoidElement(target) ? target.parentElement : target;

    // workingElement.append(GUIDELINE)
    addFocusBorder(workingElement, 'focusBorder')

    const childCount = workingElement.children.length
    if (!childCount) {
        workingElement.append(GUIDELINE)
    }
    else {
        let minClientChildDistanceY = 2000;
        let nearestChild;
        let adjascentPosition = 'afterend';
        const {clientY} = event
        //find nearest child to cursor position (Y-axis)
        for (let i = 0; i < childCount; i++) {
            const child = workingElement.children[i];

            //child position
            const rect = child.getBoundingClientRect();
            const childTop = rect.top;
            const childBottom = rect.bottom;
            const childHeight = childBottom - childTop;

            const clientChildDistanceY = Math.sqrt((clientY - childTop)**2)    //calc difference and return positive number

            //top half or bottom half of child
            if (clientChildDistanceY < minClientChildDistanceY) {
                minClientChildDistanceY = clientChildDistanceY;
                nearestChild = child;
                const  childMidPointY = childTop + (childHeight / 2);
                if (clientY > childMidPointY) adjascentPosition = 'afterend'
                else adjascentPosition = 'beforebegin'
            }
        }
        nearestChild.insertAdjacentElement(adjascentPosition, GUIDELINE);
    }
}

function removePlacementGuides(event) {
    const target = event.target
    if (target.id == 'guideline') return
    const workingElement = isVoidElement(target) ? target.parentElement : target;
    removeFocusBorder(workingElement, 'focusBorder'); 
}

// MUTE
function muteElement(element) {
    element.classList.add('muted');
}
function unmuteElement(element) {
    element.classList.remove('muted');
}
// BORDERS
function addFocusBorder(element, borderClassName) {
    if (element.id == 'guideline') return
    element.classList.add(borderClassName)
}
function removeFocusBorder(element, borderClassName) {
    element.classList.remove(borderClassName)
}

/**
 * returns true if an HTML element is void (cannot have any child nodes)
 * @param {Element} element tag name of element
 * @return {Boolean}
 */
 function isVoidElement(element) {
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
    'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'textarea', 'h1', 
    'h2', 'h3', 'h4', 'h5', 'h6'];
    if (voidElements.includes(element.tagName.toLowerCase())) return true;
    if (element.dataset.void == 'true') return true
    return false
  }


function makeDraggable(element) {
    element.draggable = true
    element.ondragstart = (event) => {
        event.dataTransfer.setData("text", event.target.id);
        muteElement(event.target)
    }
    element.ondragend = (event) => {
        unmuteElement(event.target)
    }
}
function makeDropTarget(element) {
    element.ondragover = (event) => {
        event.preventDefault();
        showPlacementGuides(event);
    }
    element.ondragleave = (event) => {
        removePlacementGuides(event);
    }
    element.ondrop = (event) => {
        const draggedElement = document.getElementById(event.dataTransfer.getData('text'));
        GUIDELINE.insertAdjacentElement('afterend', draggedElement);
        GUIDELINE.remove();
        removePlacementGuides(event);
    }
}