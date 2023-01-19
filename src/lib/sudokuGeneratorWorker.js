import { generateSudoku } from "./sudoku/generator";

export const messageType = {
  positionProcessed: "positionProcessed",
  sudokuGenerated: "sudokuGenerated"
}

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
  self.postMessage({ 
    messageType: messageType.positionProcessed, 
    processedPositionsCount: processedPositionsCount 
  });
}

function sendSudokuGeneratedMessage(generatedSudoku) {
  self.postMessage({ 
    messageType: messageType.sudokuGenerated, 
    generatedSudoku: generatedSudoku 
  });
}
