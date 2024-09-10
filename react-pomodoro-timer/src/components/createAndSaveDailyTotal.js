const DailyTotal = require('../models/DailyTotal');

function createAndSaveDailyTotal() {
  const newTotal = new DailyTotal({
    date: new Date(),
    totalValue: 1000
  });

  return newTotal.save()
    .then(() => {
      console.log('Daily total saved');
      return 'Daily total saved';
    })
    .catch(err => {
      console.error('Error saving daily total:', err);
      throw err;
    });
}

module.exports = {
  createAndSaveDailyTotal
};