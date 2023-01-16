"use strict";

const GUIDELINE = document.createElement('div');
GUIDELINE.id = 'drop_target_guideline';
GUIDELINE.style.margin = '2px auto';
GUIDELINE.style.border = '1px solid';

/**
 * displays a guideline adjascent the nearest element to the user's cursor and a border around the containing element.
 * @param {Event} event drag event
 * @param {string} guidelineColor guideline css color value
 * @param {string} focusborderColor focus border css color value
 */
function showDropTargetGuides(event, guidelineColor, focusborderColor) {
    const target = event.target
    if (target.id == 'drop_target_guideline') return

    //styling
    GUIDELINE.style.setProperty('border-color', guidelineColor)

    const workingElement = isVoidElement(target) ? target.parentElement : target;

    addFocusBorder(workingElement, focusborderColor);

    const childrenLength = workingElement.children.length
    if (!childrenLength) {
        workingElement.append(GUIDELINE)
    } else {
        let minClientChildDistanceY = 2000;
        let nearestChild;
        let adjascentPosition = 'afterend';
        const {clientY} = event
        //find nearest child to cursor position (Y-axis)
        for (let i = 0; i < childrenLength; i++) {
            const child = workingElement.children[i];

            //child position & dimensions
            const rect = child.getBoundingClientRect();
            const childTop = rect.top;
            const childBottom = rect.bottom;
            const childHeight = childBottom - childTop;

            const clientChildDistanceY = Math.sqrt((clientY - childTop)**2)    //calc difference and return positive number

            if (clientChildDistanceY < minClientChildDistanceY) {
                minClientChildDistanceY = clientChildDistanceY;
                nearestChild = child;
                const  childMidPointY = childTop + (childHeight / 2);
                if (clientY > childMidPointY) adjascentPosition = 'afterend'
                else adjascentPosition = 'beforebegin'
            }
        }
        // add guideline
        nearestChild.insertAdjacentElement(adjascentPosition, GUIDELINE);
    }
}

function hideDropTargetGuides(event) {
    const target = event.target
    if (target.id == 'drop_target_guideline') return
    const workingElement = isVoidElement(target) ? target.parentElement : target;
    removeFocusBorder(workingElement); 
}
function muteElement(element) {
    element.style.opacity = '0.4';
}
function unmuteElement(element) {
    element.style.opacity = '1';
}

/**
 * set the border for an element
 * @param {*} element element on which to set a border
 * @param {string} color focus border css color value
 */
function addFocusBorder(element, color) {
    if (element.id == 'drop_target_guideline') return
    element.style.setProperty('border', `1px dashed ${color}`, 'important')
}
function removeFocusBorder(element) {
    element.style.setProperty('border', 'inherit');
}

/**
 * returns true if an HTML element is void or has been set to void.
 * an element can be set to void by setting its data-void attribute to "true"
 * @param {Element} element element to check if void
 * @return {Boolean} true if void, false if not
 */
 function isVoidElement(element) {
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
    'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'textarea', 'h1', 
    'h2', 'h3', 'h4', 'h5', 'h6'];
    if (voidElements.includes(element.tagName.toLowerCase())) return true;
    if (element.dataset.void == 'true') return true
    return false
  }

/**
 * makes element draggable & adds relevant drag event handlers to it.
 * @param {Element} element element with unique id value.
 */
function makeDraggable(element) {
    //error handling
    if (!(element instanceof Element)) throw new TypeError(`${typeof element} '${element}' is not a DOM Element`);
    if (!element.id) throw new TypeError(`${element.tagName} Element cannot be made draggable without an id value. All draggable Elements must have a unique id value.`);

    element.draggable = true
    element.ondragstart = (event) => {
        event.dataTransfer.setData("text", event.target.id);
        muteElement(event.target);
    }
    element.ondragend = (event) => {
        unmuteElement(event.target)
    }
}

/**
 * adds relevant drag event handlers to drop zone container.
 * @param {Element} container container wherein dragged elements can be dropped.
 * @param {{guidelineColor: string, focusborderColor: string } | undefined} options css color values
 */
function makeDropZone(container, options = {guidelineColor: '#c80cce', focusborderColor: 'red'}) {
    //error handling
    if (!(container instanceof Element)) throw new TypeError(`${typeof container} '${container}' is not a DOM Element`);

    container.ondragover = (event) => {
        event.preventDefault();
        const { guidelineColor, focusborderColor } = options;
        showDropTargetGuides(event, guidelineColor, focusborderColor);
    }
    container.ondragleave = (event) => {
        hideDropTargetGuides(event);
    }
    container.ondrop = (event) => {
        const elementId = event.dataTransfer.getData('text')
        const droppedElement = document.getElementById(elementId);

        //replace guideline with dropped element
        GUIDELINE.insertAdjacentElement('afterend', droppedElement);
        GUIDELINE.remove();

        hideDropTargetGuides(event);
    }
}

export {
    makeDraggable,
    makeDropZone
}