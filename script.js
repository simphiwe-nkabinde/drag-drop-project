const GUIDELINE = document.getElementById('guideline');

// DRAG/DROP EVENT HANDLDERS -----------------
function onDragOverHandler(event) {
    event.preventDefault();
}
function onDragEnterHandler(event) {
    //if element is empty
    if (!event.target.children.length && !event.target.innerText)  {
        addFocusBorder(event.target, 'redDashedBorder')
        hideGuideline()
    }
    else {
        addFocusBorder(event.target.parentElement, 'redDashedBorder')
        appendSibling(event.target, GUIDELINE)
    }
}
function onDragLeaveHandler(event) {
    if (!event.target.children.length && !event.target.innerText) {
        removeFocusBorder(event.target, 'redDashedBorder');   
    } else {
        removeFocusBorder(event.target.parentElement, 'redDashedBorder');        
    } 
}
function onDragStartHandler(event) {
    event.dataTransfer.setData("text", event.target.id);
    muteElement(event.target)
}
function onDragEndHandler(event) {
    unmuteElement(event.target);
}
function onDropHandler(event) {
    event.preventDefault();

    const data = event.dataTransfer.getData("text");

    let prevPos = getElementPosition(document.getElementById(data))
    let oldParent = getParentElement(document.getElementById(data)).id
    let newPos = getGuidelinePosition();

    //if drag and drop is inside the same parent element
    if (document.getElementById(data).parentElement.id == event.target.parentElement.id) {
        if (newPos > prevPos) newPos-= 1;
        else prevPos -= 1
    }
    
    // OUTPUT
    const output = {
        prevPos,
        newPos,
        newParent: getParentElement(event.target).id,
        oldParent
    }
    console.log(output);


    removeFocusBorder(event.target.parentElement, 'redDashedBorder');

    if (!event.target.children.length && !event.target.innerText) {
        event.target.append(document.getElementById(data))
    } else {
        appendSibling(event.target, document.getElementById(data))
    }
    hideGuideline()
}
// -----------------------------------------------


//UTILITY FUNCTIONS ------------------------------
function hideGuideline() {
    GUIDELINE.remove()
}
/**
 * adds a class name to an element
 * @param {Element} element element to add border to
 * @param {string} borderClassName class name for border styling
 */
function addFocusBorder(element, borderClassName) {
    if (element.id == 'guideline') return
    element.classList.add(borderClassName)
}
/**
 * removes a class name from an element
 * @param {Element} element element to remove border
 * @param {string} borderClassName class name for border styling
 */
function removeFocusBorder(element, borderClassName) {
    element.classList.remove(borderClassName)
}
function muteElement(element) {
    element.classList.add('muted');
}
function unmuteElement(element) {
    element.classList.remove('muted');
}
/**
 * append a sibling element to an element
 * @param {Element} currentElement element to append with a next sibling
 * @param {Element} nextSibling 
 */
function appendSibling(currentElement, nextSibling) {
    currentElement.insertAdjacentElement('afterend', nextSibling)
}
/**
 * returns index of guideline element from the parentElement.children array
 * @returns {number} index of guidline element
 */
function getGuidelinePosition() {
    if (!document.body.contains(GUIDELINE)) {
        return 0;
    }
    const parentChildren = GUIDELINE.parentElement.children;
    for (let i = 0; i < parentChildren.length; i++) {
        const child = parentChildren[i];
        if (child.id == 'guideline') {
            return i
        }
    }
}
function getParentElement(element) {
    if (!document.body.contains(GUIDELINE)) {
        return element;
    } else {
        return element.parentElement
    }
}
/**
 * returns index of an element from the parentElement.children array
 * @param {Element} element
 * @returns {number} index of the element
 */
function getElementPosition(element) {
    const parentChildren = element.parentElement.children;
    for (let i = 0; i < parentChildren.length; i++) {
        const child = parentChildren[i];
        if (child.id == element.id) {
            return i
        }
    }
}