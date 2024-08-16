const container = document.querySelector('.container');

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        console.log(data);
         populateDivs(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function populateDivs(data) {
    container.innerHTML = '';
    data.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'draggable';
        div.id = `div${index + 1}`;
        div.draggable = true;

        const positionLabel = document.createElement('span');
        positionLabel.className = 'position';
        positionLabel.textContent = `Position: ${index + 1}`; 

        div.textContent = item.name;
        div.appendChild(positionLabel);
        container.appendChild(div);
    });
    initializeDraggable();
}

function initializeDraggable() {
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
        });

        draggable.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            updatePositions();   
        });
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(dragging);
        } else {
            container.insertBefore(dragging, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}

function updatePositions() {
    const draggables = Array.from(container.querySelectorAll('.draggable'));
    draggables.forEach((div, index) => {
        const positionLabel = div.querySelector('.position');
        positionLabel.textContent = `Position: ${index + 1}`;
    });
}
