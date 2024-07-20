const accessKey = '3AFLLl7ERpW52k8ZWoI5ZZ8bWxJwsp2E_GwHhKw6hM4';

document.getElementById('shuffle-btn').addEventListener('click', shufflePieces);
document.addEventListener('keydown', handleKeyPress);

async function fetchRandomImage() {
    const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}&query=nature&orientation=squarish`);
    const data = await response.json();
    return data.urls.regular;
}

function createPuzzlePieces(imageUrl) {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';
    const pieces = [];
    for (let i = 0; i < 9; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundPosition = `${-(i % 3) * 100}px ${-Math.floor(i / 3) * 100}px`;
        piece.dataset.index = i;
        piece.addEventListener('click', () => movePiece(i));
        pieces.push(piece);
        container.appendChild(piece);
    }
    pieces[8].classList.add('empty');
    pieces[8].style.backgroundImage = 'none';
    return pieces;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shufflePieces() {
    fetchRandomImage().then(imageUrl => {
        const pieces = createPuzzlePieces(imageUrl);
        shuffleArray(pieces);
        const container = document.getElementById('puzzle-container');
        container.innerHTML = '';
        pieces.forEach(piece => container.appendChild(piece));
    });
}

function swapPieces(piece1, piece2) {
    const tempIndex = piece1.dataset.index;
    piece1.dataset.index = piece2.dataset.index;
    piece2.dataset.index = tempIndex;

    const tempBackgroundImage = piece1.style.backgroundImage;
    piece1.style.backgroundImage = piece2.style.backgroundImage;
    piece2.style.backgroundImage = tempBackgroundImage;

    const tempBackgroundPosition = piece1.style.backgroundPosition;
    piece1.style.backgroundPosition = piece2.style.backgroundPosition;
    piece2.style.backgroundPosition = tempBackgroundPosition;
}

function movePiece(index) {
    const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    const emptyPiece = pieces.find(piece => piece.classList.contains('empty'));
    const emptyIndex = pieces.indexOf(emptyPiece);

    if ([index - 1, index + 1, index - 3, index + 3].includes(emptyIndex)) {
        swapPieces(pieces[index], emptyPiece);
    }

    if (isSolved()) {
        document.getElementById('instruction-text').innerText = "Congratulations! You solved the puzzle!";
    }
}

function handleKeyPress(event) {
    const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    const emptyPiece = pieces.find(piece => piece.classList.contains('empty'));
    const emptyIndex = pieces.indexOf(emptyPiece);

    let targetIndex;
    switch (event.key) {
        case 'ArrowUp':
            targetIndex = emptyIndex + 3;
            break;
        case 'ArrowDown':
            targetIndex = emptyIndex - 3;
            break;
        case 'ArrowLeft':
            targetIndex = emptyIndex + 1;
            break;
        case 'ArrowRight':
            targetIndex = emptyIndex - 1;
            break;
        default:
            return;
    }

    if (targetIndex >= 0 && targetIndex < 9) {
        swapPieces(pieces[emptyIndex], pieces[targetIndex]);
    }

    if (isSolved()) {
        document.getElementById('instruction-text').innerText = "Congratulations! You solved the puzzle!";
    }
}

function isSolved() {
    const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    return pieces.every((piece, index) => piece.dataset.index == index);
}

window.onload = shufflePieces;
