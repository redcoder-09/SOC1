import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const TILE_TYPE = 'tile';

const generateInitialTiles = () => {
  const tiles = Array.from({ length: 15 }, (_, index) => index + 1);
  tiles.push(null);
  return shuffle(tiles);
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const isSolved = (tiles) => {
  for (let i = 0; i < 15; i++) {
    if (tiles[i] !== i + 1) {
      return false;
    }
  }
  return true;
};

const Tile = ({ number, index, moveTile, canMove, isCorrect }) => {
  const [, ref] = useDrag({
    type: TILE_TYPE,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: TILE_TYPE,
    drop: (item) => moveTile(item.index, index),
    canDrop: (item) => canMove(item.index, index),
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`tile ${isCorrect ? 'correct' : ''}`}
    >
      {number}
    </div>
  );
};

const Puzzle = () => {
  const [tiles, setTiles] = useState(generateInitialTiles);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isSolved(tiles)) {
      setWon(true);
    }
  }, [tiles]);

  const moveTile = useCallback((fromIndex, toIndex) => {
    if (won) return;

    const newTiles = [...tiles];
    [newTiles[fromIndex], newTiles[toIndex]] = [newTiles[toIndex], newTiles[fromIndex]];
    setTiles(newTiles);
    setMoves(moves + 1);
  }, [tiles, moves, won]);

  const canMove = (fromIndex, toIndex) => {
    const blankIndex = tiles.indexOf(null);
    return toIndex === blankIndex && (
      fromIndex === blankIndex - 1 ||
      fromIndex === blankIndex + 1 ||
      fromIndex === blankIndex - 4 ||
      fromIndex === blankIndex + 4
    );
  };

  const startNewGame = () => {
    setTiles(generateInitialTiles());
    setMoves(0);
    setSeconds(0);
    setWon(false);
  };

  return (
    <div className="puzzle-container">
      <div className="status">
        <div>Moves: {moves}</div>
        <div>Time: {seconds}s</div>
      </div>
      {won && <div className="winner">Congratulations You Won!</div>}
      <div className="puzzle-grid">
        {tiles.map((number, index) => (
          <Tile
            key={index}
            number={number}
            index={index}
            moveTile={moveTile}
            canMove={canMove}
            isCorrect={number === index + 1}
          />
        ))}
      </div>
      <button onClick={startNewGame} className="new-game-button">New Game</button>
    </div>
  );
};

const App = () => (
  <DndProvider backend={HTML5Backend}>
    <Puzzle />
  </DndProvider>
);

export default App;
