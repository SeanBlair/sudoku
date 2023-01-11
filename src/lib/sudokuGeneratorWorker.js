import { getAllSudokuCoordinatesShuffled, generateSolvedSudoku, removeClueIfNotNeededForASingleSolution } from "./sudokuGenerator";

self.onmessage = (event) => {
  if (event.data.generateSudoku) {
    generatingASudokuAndSendProgressUpdates();
  }
}

function generatingASudokuAndSendProgressUpdates() {
  const solvedSudoku = generateSolvedSudoku();
  const allPositions = getAllSudokuCoordinatesShuffled();

  allPositions.forEach((position, index) => {

    // // Save this clue in case we can't remove it
    // const positionValue = solvedSudoku[position.row][position.column];
    // // Remove this clue.
    // solvedSudoku[position.row][position.column] = emptySudokuCellValue;

    // if (!hasExactlyOneSolution(solvedSudoku)) {
    //   // We can't remove this clue.
    //   solvedSudoku[position.row][position.column] = positionValue;
    // }
    removeClueIfNotNeededForASingleSolution(position, solvedSudoku);

    // Todo: can we simply send this function with a call to generateSudoku();
    sendPositionProcessedMessage(index);
  });

  sendSudokuGeneratedMessage(solvedSudoku);
}

function sendPositionProcessedMessage(processedPositionsCount) {
  self.postMessage({ messageType: 'positionProcessed', processedPositionsCount: processedPositionsCount });
}

function sendSudokuGeneratedMessage(generatedSudoku) {
  self.postMessage({ messageType: 'sudokuGenerated', generatedSudoku: generatedSudoku });
}