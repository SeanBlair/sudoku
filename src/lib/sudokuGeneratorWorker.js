import { generateSudoku } from "./sudokuGenerator";

self.onmessage = (event) => {
  if (event.data.generateSudoku) {
    generateSudokuAndSendProgressUpdates();
  }
}

function generateSudokuAndSendProgressUpdates() {
  const sudoku = generateSudoku(sendPositionProcessedMessage);
  sendSudokuGeneratedMessage(sudoku);
}

function sendPositionProcessedMessage(processedPositionsCount) {
  self.postMessage({ messageType: 'positionProcessed', processedPositionsCount: processedPositionsCount });
}

function sendSudokuGeneratedMessage(generatedSudoku) {
  self.postMessage({ messageType: 'sudokuGenerated', generatedSudoku: generatedSudoku });
}